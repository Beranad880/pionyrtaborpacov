import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import connectToMongoose from '@/lib/mongoose';

export async function GET(request: NextRequest) {
  try {
    // Test basic MongoDB connection
    const { client, db } = await connectToDatabase();

    // Test database operations
    const collections = await db.listCollections().toArray();

    // Test Mongoose connection
    await connectToMongoose();

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}