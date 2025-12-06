import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Funkce pro ověření admin cookie (bez MongoDB - Edge Runtime kompatibilní)
function verifyAdminAuth(request: NextRequest): boolean {
  try {
    const authCookie = request.cookies.get('admin_auth');

    if (!authCookie) {
      return false;
    }

    // Dekódovat auth token
    const decoded = Buffer.from(authCookie.value, 'base64').toString('utf-8');
    const [userId, username, timestamp] = decoded.split(':');

    if (!userId || !username || !timestamp) {
      return false;
    }

    // Kontrola platnosti (7 dní)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dní v milisekundách

    if (tokenAge > maxAge) {
      return false;
    }

    // Základní validace formátu (bez DB kontroly)
    // DB kontrola se provede při API callech
    return userId.length > 0 && username.length >= 3;

  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Chránit všechny /admin/* cesty kromě login stránky
  if (pathname.startsWith('/admin')) {
    // Povolit přístup k login stránce
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Kontrola autentifikace
    const isAuthenticated = verifyAdminAuth(request);

    if (!isAuthenticated) {
      // Přesměrovat na login stránku
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Konfigurace cest, kde má middleware fungovat
export const config = {
  matcher: [
    '/admin/:path*'
  ]
};