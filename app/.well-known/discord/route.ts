export const dynamic = 'force-static';

export function GET() {
  return new Response('dh=b0b82ee94a1399e6a464b31997407f5a0cd64123', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
