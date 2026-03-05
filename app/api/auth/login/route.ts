import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import AdminUser from '@/models/AdminUser';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting podle IP adresy
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const rateCheck = checkRateLimit(`login:${ip}`);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, message: `Příliš mnoho pokusů o přihlášení. Zkuste to znovu za ${rateCheck.retryAfter} sekund.` },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    await connectToMongoose();

    const userDoc = await AdminUser.findOne({ username, isActive: true }).select('+password');

    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await userDoc.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Úspěšné přihlášení - resetovat rate limit
    resetRateLimit(`login:${ip}`);

    await AdminUser.findByIdAndUpdate(userDoc._id, { lastLogin: new Date() });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userDoc._id,
        username: userDoc.username,
        lastLogin: new Date()
      }
    });

    const authToken = Buffer.from(`${userDoc._id}:${userDoc.username}:${Date.now()}`).toString('base64');

    response.cookies.set('admin_auth', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dní
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
