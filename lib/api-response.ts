import { NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';

export function dbError(error: unknown, context?: string): NextResponse {
  if (context) console.error(context, error);
  const detail = isDev && error instanceof Error ? { detail: error.message } : {};
  return NextResponse.json(
    { success: false, message: 'Interní chyba serveru', ...detail },
    { status: 500 }
  );
}
