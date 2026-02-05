import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware pro ověření admin autentizace
 * Použití v API routes:
 *
 * import { requireAuth } from '@/lib/auth-middleware';
 *
 * export async function GET(request: NextRequest) {
 *   const authError = requireAuth(request);
 *   if (authError) return authError;
 *   // ... zbytek kódu
 * }
 */

export function requireAuth(request: NextRequest): NextResponse | null {
  const authCookie = request.cookies.get('admin_auth');

  if (!authCookie || !authCookie.value) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized - please login' },
      { status: 401 }
    );
  }

  try {
    // Dekódování a validace tokenu
    const decoded = Buffer.from(authCookie.value, 'base64').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length < 3) {
      return NextResponse.json(
        { success: false, message: 'Invalid auth token format' },
        { status: 401 }
      );
    }

    const [userId, username, timestamp] = parts;

    // Kontrola expirace (7 dní)
    const tokenTime = parseInt(timestamp, 10);
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (isNaN(tokenTime) || now - tokenTime > sevenDays) {
      return NextResponse.json(
        { success: false, message: 'Auth token expired' },
        { status: 401 }
      );
    }

    // Token je validní
    return null;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid auth token' },
      { status: 401 }
    );
  }
}

/**
 * Helper pro získání user info z tokenu
 */
export function getUserFromToken(request: NextRequest): { userId: string; username: string } | null {
  const authCookie = request.cookies.get('admin_auth');

  if (!authCookie || !authCookie.value) {
    return null;
  }

  try {
    const decoded = Buffer.from(authCookie.value, 'base64').toString('utf-8');
    const [userId, username] = decoded.split(':');
    return { userId, username };
  } catch {
    return null;
  }
}
