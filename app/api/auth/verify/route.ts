import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import AdminUser from '@/models/AdminUser';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_auth')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication cookie' },
        { status: 401 }
      );
    }

    let payload: { userId: string; username: string };
    try {
      payload = await verifyToken(token);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    await connectToMongoose();

    const user = await AdminUser.findById(payload.userId);

    if (!user || user.username !== payload.username || !user.isActive) {
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
        lastLogin: user.lastLogin,
      },
    });

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
