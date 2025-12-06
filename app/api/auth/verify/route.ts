import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import AdminUser from '@/models/AdminUser';
import SimpleAdminUser from '@/models/SimpleAdminUser';

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('admin_auth');

    if (!authCookie) {
      return NextResponse.json(
        { success: false, message: 'No authentication cookie' },
        { status: 401 }
      );
    }

    // Dekódovat auth token
    const decoded = Buffer.from(authCookie.value, 'base64').toString('utf-8');
    const [userId, username, timestamp] = decoded.split(':');

    if (!userId || !username || !timestamp) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Kontrola platnosti (7 dní)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dní v milisekundách

    if (tokenAge > maxAge) {
      return NextResponse.json(
        { success: false, message: 'Authentication token expired' },
        { status: 401 }
      );
    }

    // Připojení k databázi a ověření existence uživatele
    await connectToMongoose();

    // Try SimpleAdminUser first, then AdminUser
    let user = await SimpleAdminUser.findById(userId);
    if (!user) {
      user = await AdminUser.findById(userId);
    }

    if (!user || user.username !== username) {
      return NextResponse.json(
        { success: false, message: 'Invalid user credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        lastLogin: user.lastLogin
      }
    });

  } catch (error: any) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}