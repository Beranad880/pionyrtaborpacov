import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

/**
 * Middleware pro ověření admin autentizace
 * Použití v API routes:
 *
 * import { requireAuth } from '@/lib/auth-middleware';
 *
 * export async function GET(request: NextRequest) {
 *   const authError = await requireAuth(request);
 *   if (authError) return authError;
 *   // ... zbytek kódu
 * }
 */

function unauthorized(message = 'Unauthorized - please login'): NextResponse {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get('admin_auth')?.value;
  if (!token) return unauthorized();

  try {
    await verifyToken(token);
    return null;
  } catch {
    return unauthorized('Invalid or expired auth token');
  }
}

/**
 * Helper pro získání user info z tokenu
 */
export async function getUserFromToken(request: NextRequest): Promise<{ userId: string; username: string } | null> {
  const token = request.cookies.get('admin_auth')?.value;
  if (!token) return null;

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
