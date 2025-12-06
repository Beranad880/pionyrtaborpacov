import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Rental from '@/models/Rental';
import RentalRequest from '@/models/RentalRequest';

// GET - Načíst pronájmy
export async function GET(request: NextRequest) {
  try {
    // Kontrola autentifikace
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;
    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const rentals = await Rental.find(filter)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Rental.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        rentals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error('GET /api/admin/rental error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rentals', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Vytvořit nový pronájem
export async function POST(request: NextRequest) {
  try {
    // Kontrola autentifikace
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoose();

    const body = await request.json();

    const requiredFields = ['name', 'email', 'phone', 'startDate', 'endDate', 'guestCount', 'purpose'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} je povinný` },
          { status: 400 }
        );
      }
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (endDate <= startDate) {
      return NextResponse.json(
        { success: false, message: 'Datum odjezdu musí být po datu příjezdu' },
        { status: 400 }
      );
    }

    // Check for conflicts with existing approved requests and confirmed rentals
    const conflictingRequests = await RentalRequest.find({
      status: 'approved',
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    const conflictingRentals = await Rental.find({
      status: { $in: ['confirmed', 'paid'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (conflictingRequests.length > 0 || conflictingRentals.length > 0) {
      return NextResponse.json(
        { success: false, message: 'V tomto termínu je hájenka již zarezervována' },
        { status: 409 }
      );
    }

    const rental = new Rental(body);

    await rental.save();

    return NextResponse.json({
      success: true,
      message: 'Pronájem byl úspěšně vytvořen',
      data: rental
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/admin/rental error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create rental', error: error.message },
      { status: 500 }
    );
  }
}
