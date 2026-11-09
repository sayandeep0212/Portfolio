import { NextResponse } from 'next/server';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const runtime = 'nodejs';

// Max 5 contact form submissions per 15 minutes per IP
const contactLimiter = new RateLimiter({ intervalMs: 900_000, maxRequests: 5 });

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Sends an auto-reply confirmation email to the user via EmailJS API
 */
async function sendEmailJSAutoReply({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): Promise<{ sent: boolean; error?: string }> {
  const serviceId =
    process.env.EMAILJS_SERVICE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId =
    process.env.EMAILJS_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey =
    process.env.EMAILJS_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.log(
      'ℹ️ EmailJS credentials not set yet (EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY). Auto-reply will be sent once env variables are provided.'
    );
    return { sent: false, error: 'EmailJS not configured' };
  }

  try {
    const payload: Record<string, any> = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_name: name,
        to_email: email,
        user_name: name,
        user_email: email,
        recipient_email: email,
        reply_to: 'sayandeep0212@gmail.com',
        user_message: message,
        message: message,
        portfolio_owner: 'Sayandeep Pradhan',
        auto_reply_message:
          'Thank you for reaching out! I have received your message and will check it and get back to you as soon as possible.',
      },
    };

    if (privateKey) {
      payload.accessToken = privateKey;
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('EmailJS response warning:', response.status, errText);
      return { sent: false, error: errText };
    }

    console.log(`✅ Auto-reply email successfully sent via EmailJS to ${email}`);
    return { sent: true };
  } catch (err: any) {
    console.warn('EmailJS auto-reply exception:', err.message);
    return { sent: false, error: err.message };
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = contactLimiter.check(ip);

  if (!rate.success) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many submissions. Please wait ${Math.ceil(rate.resetMs / 60_000)} minutes before trying again.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rate.resetMs / 1000)) },
      }
    );
  }

  try {
    const body: ContactPayload = await request.json();
    const { name, email, message } = body;

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 5 characters long.' },
        { status: 400 }
      );
    }

    // Save message directly to Firestore "contacts" collection
    await addDoc(collection(db, 'contacts'), {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      ip,
      read: false,
      createdAt: Date.now(),
      createdAtIso: new Date().toISOString(),
    });

    // Send auto-reply confirmation email to the visitor via EmailJS
    const emailResult = await sendEmailJSAutoReply({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        emailSent: emailResult.sent,
        message:
          'Your message has been sent successfully! A confirmation email has been dispatched to your inbox. Sayandeep will get back to you as soon as possible.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

