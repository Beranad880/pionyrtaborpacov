import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import BlockedPeriod from '@/models/BlockedPeriod';
import { requireAuth } from '@/lib/auth-middleware';
import { validateDateRange } from '@/lib/validation';
import { dbError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const periods = await BlockedPeriod.find().sort({ startDate: 1 }).lean();
    return NextResponse.json({ success: true, data: periods });
  } catch (error) {
    return dbError(error, 'GET /api/admin/blocked-periods error:');
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { startDate, endDate, label } = await request.json();

    if (!startDate || !endDate || !label) {
      return NextResponse.json(
        { success: false, message: 'startDate, endDate a label jsou povinné' },
        { status: 400 }
      );
    }

    const dateError = validateDateRange(new Date(startDate), new Date(endDate));
    if (dateError) {
      return NextResponse.json({ success: false, message: dateError }, { status: 400 });
    }

    const period = await BlockedPeriod.create({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      label
    });

    return NextResponse.json({ success: true, data: period }, { status: 201 });
  } catch (error) {
    return dbError(error, 'POST /api/admin/blocked-periods error:');
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID je povinné' }, { status: 400 });
    }

    await BlockedPeriod.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return dbError(error, 'DELETE /api/admin/blocked-periods error:');
  }
}
