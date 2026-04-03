import { NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Rental from '@/models/Rental';
import RentalRequest from '@/models/RentalRequest';
import BlockedPeriod from '@/models/BlockedPeriod';

export async function GET() {
  try {
    await connectToMongoose();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get approved rental requests that haven't ended yet
    const approvedRequests = await RentalRequest.find({
      status: 'approved',
      endDate: { $gte: today }
    })
      .select('startDate endDate')
      .lean();

    // Get confirmed/paid rentals that haven't ended yet
    const confirmedRentals = await Rental.find({
      status: { $in: ['confirmed', 'paid'] },
      endDate: { $gte: today }
    })
      .select('startDate endDate')
      .lean();

    // Get admin-blocked periods
    const blockedPeriods = await BlockedPeriod.find({ endDate: { $gte: today } })
      .select('startDate endDate')
      .lean();

    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(date);

    // Combine and format the occupied periods
    const occupiedPeriods = [
      ...approvedRequests.map(r => ({
        startDate: formatDate(r.startDate),
        endDate: formatDate(r.endDate)
      })),
      ...confirmedRentals.map(r => ({
        startDate: formatDate(r.startDate),
        endDate: formatDate(r.endDate)
      })),
      ...blockedPeriods.map(r => ({
        startDate: formatDate(r.startDate),
        endDate: formatDate(r.endDate)
      }))
    ];

    return NextResponse.json({
      success: true,
      data: {
        occupiedPeriods
      }
    });
  } catch (error: unknown) {
    console.error('GET /api/rental-availability error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
