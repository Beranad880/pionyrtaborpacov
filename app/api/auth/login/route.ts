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

    // Najít uživatele přímo z DB
    const db = mongoose.connection.db;
    console.log('Looking for username:', username);
    const userDoc = await db.collection('adminusers').findOne({ username });
    console.log('User found in DB:', userDoc ? 'yes' : 'no');

    if (userDoc) {
      console.log('Found user:', userDoc.username, 'with ID:', userDoc._id);
    }

    // Debug: list all users
    const allUsers = await db.collection('adminusers').find({}).toArray();
    console.log('All users in DB:', allUsers.map(u => u.username));

    if (!userDoc) {
      console.log('User not found in DB');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('User password hash length:', userDoc.password?.length);

    // Kontrola hesla přímo s bcrypt
    console.log('Comparing password with bcrypt...');
    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare(password, userDoc.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password comparison failed');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Aktualizovat lastLogin přímo v DB
    await db.collection('adminusers').updateOne(
      { _id: userDoc._id },
      { $set: { lastLogin: new Date() } }
    );

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

