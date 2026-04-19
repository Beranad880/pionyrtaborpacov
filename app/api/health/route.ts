import { NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';

export async function GET() {
  const start = Date.now();

  try {
    await connectToMongoose();
    const dbLatencyMs = Date.now() - start;

    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      dbLatencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        db: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
