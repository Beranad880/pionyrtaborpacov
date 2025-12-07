import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import AdminUser from '@/models/AdminUser';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log('Login attempt:', { username, passwordLength: password?.length });

    // Validace vstupních dat
    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Připojení k databázi
    await connectToMongoose();
    console.log('Connected to database');
    console.log('Current DB name:', mongoose.connection.db?.databaseName);

    // Find user in AdminUser collection
    console.log('Looking for username:', username);
    const userDoc = await AdminUser.findOne({ username, isActive: true }).select('+password');

    if (!userDoc) {
      console.log('User not found or inactive');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Found user:', userDoc.username, 'with ID:', userDoc._id);

    // Compare password using model method
    const isPasswordValid = await userDoc.comparePassword(password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password comparison failed');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update lastLogin
    await AdminUser.findByIdAndUpdate(userDoc._id, { lastLogin: new Date() });

    // Vytvořit response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userDoc._id,
        username: userDoc.username,
        lastLogin: new Date()
      }
    });

    // Nastavit cookie s jednoduchým auth tokenem
    const authToken = Buffer.from(`${userDoc._id}:${userDoc.username}:${Date.now()}`).toString('base64');

    response.cookies.set('admin_auth', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dní
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

