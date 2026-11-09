import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Max file size: 25MB (as requested)
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

const ALLOWED_MIME_PREFIXES = ['image/', 'video/'];

// Rate limit: 20 uploads per 10 minutes per IP
const uploadLimiter = new RateLimiter({ intervalMs: 600_000, maxRequests: 20 });

function getR2Client(): { client: S3Client; bucket: string; publicUrl: string } | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });

  return { client, bucket, publicUrl: publicUrl || '' };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = uploadLimiter.check(ip);

  if (!rate.success) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many upload requests. Please wait ${Math.ceil(rate.resetMs / 60_000)} minutes before uploading again.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rate.resetMs / 1000)) },
      }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum limit of 25MB.' },
        { status: 400 }
      );
    }

    const mimeType = file.type || 'application/octet-stream';
    const isAllowed = ALLOWED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix));
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: 'Only image and video files are supported.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename & create unique key
    const rawName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(rawName) || (mimeType.startsWith('image/') ? '.jpg' : '.mp4');
    const base = path.basename(rawName, ext);
    const key = `uploads/${Date.now()}-${base}${ext}`;

    const r2 = getR2Client();

    if (r2) {
      try {
        // Upload to Cloudflare R2 bucket
        const command = new PutObjectCommand({
          Bucket: r2.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        });

        await r2.client.send(command);

        const finalUrl = r2.publicUrl
          ? `${r2.publicUrl.replace(/\/$/, '')}/${key}`
          : `https://${r2.bucket}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

        return NextResponse.json({
          success: true,
          url: finalUrl,
          storage: 'cloudflare-r2',
          name: file.name,
          size: file.size,
          mimeType,
        });
      } catch (r2Err: any) {
        console.error('Cloudflare R2 PutObject error:', r2Err);
        if (r2Err.name === 'AccessDenied' || r2Err.$metadata?.httpStatusCode === 403) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Cloudflare R2 Access Denied (403). Your R2 API Token was generated with Read-only permissions. Please create an R2 API Token with "Object Read & Write" permissions.',
            },
            { status: 403 }
          );
        }
        throw r2Err;
      }
    }

    // Fallback: Store locally in public/uploads if R2 is not yet configured
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const localFileName = `${Date.now()}-${base}${ext}`;
    const localFilePath = path.join(uploadDir, localFileName);
    await writeFile(localFilePath, buffer);

    const localUrl = `/uploads/${localFileName}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      storage: 'local-fallback',
      message: 'Uploaded locally (Cloudflare R2 not configured in environment)',
      name: file.name,
      size: file.size,
      mimeType,
    });
  } catch (err: unknown) {
    console.error('File upload error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to process file upload.',
      },
      { status: 500 }
    );
  }
}

