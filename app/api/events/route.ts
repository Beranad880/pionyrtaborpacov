import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Event from '@/models/Event';
import { dbError } from '@/lib/api-response';

// Veřejný GET endpoint - vrací pouze veřejné a neodvolané akce
export async function GET(request: NextRequest) {
  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming');

    const filter: any = {
      isPublic: true,
      status: { $ne: 'cancelled' },
    };

    if (upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .lean();

    return NextResponse.json({ success: true, data: { events } }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
      }
    });
  } catch (error) {
    return dbError(error, 'GET /api/events error:');
  }
}
