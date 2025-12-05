import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import RentalRequest from '@/models/RentalRequest';

// GET - Načíst žádosti o pronájem
export async function GET(request: NextRequest) {
  try {
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

    const requests = await RentalRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await RentalRequest.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error('GET /api/admin/rental-requests error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rental requests', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Vytvořit novou žádost o pronájem (veřejné API)
export async function POST(request: NextRequest) {
  try {
    await connectToMongoose();

    const body = await request.json();

    // Validace required fields
    const requiredFields = ['name', 'email', 'phone', 'startDate', 'endDate', 'guestCount', 'purpose'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} je povinný` },
          { status: 400 }
        );
      }
    }

    // Check date validity
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (startDate < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Datum příjezdu nemůže být v minulosti' },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { success: false, message: 'Datum odjezdu musí být po datu příjezdu' },
        { status: 400 }
      );
    }

    // Check for conflicts with existing approved requests
    const conflictingRequests = await RentalRequest.find({
      status: 'approved',
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (conflictingRequests.length > 0) {
      return NextResponse.json(
        { success: false, message: 'V tomto termínu je hájenka již zarezervována' },
        { status: 409 }
      );
    }

    const rentalRequest = new RentalRequest({
      name: body.name,
      email: body.email,
      phone: body.phone,
      organization: body.organization,
      startDate,
      endDate,
      guestCount: parseInt(body.guestCount),
      purpose: body.purpose,
      facilities: body.facilities || [],
      message: body.message,
      status: 'pending'
    });

    await rentalRequest.save();

    return NextResponse.json({
      success: true,
      message: 'Žádost o pronájem byla úspěšně odeslána',
      data: rentalRequest
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/admin/rental-requests error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create rental request', error: error.message },
      { status: 500 }
    );
  }
}