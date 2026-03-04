import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import BlockedPeriod from '@/models/BlockedPeriod';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const periods = await BlockedPeriod.find().sort({ startDate: 1 }).lean();
    return NextResponse.json({ success: true, data: periods });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { startDate, endDate, label } = await request.json();

    if (!startDate || !endDate || !label) {
      return NextResponse.json({ success: false, message: 'startDate, endDate a label jsou povinné' }, { status: 400 });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return NextResponse.json({ success: false, message: 'Datum konce musí být po datu začátku' }, { status: 400 });
    }

    const period = await BlockedPeriod.create({ startDate: new Date(startDate), endDate: new Date(endDate), label });
    return NextResponse.json({ success: true, data: period }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await request.json();
    await BlockedPeriod.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
