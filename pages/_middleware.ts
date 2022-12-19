import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

type Environment = 'production' | 'development' | 'other';
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const currentEnv = process.env.NODE_ENV as Environment;
  console.log('env', process.env.NODE_ENV);

  if (currentEnv === 'production' && req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(`https://${req.headers.get('host')}${req.nextUrl.pathname}`, 301);
  }
  return NextResponse.next();
}
