import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Rental from '@/models/Rental';
import RentalRequest from '@/models/RentalRequest';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { parsePagination, paginationMeta } from '@/lib/pagination';
import { validateDateRange } from '@/lib/validation';
import { dbError } from '@/lib/api-response';

// GET - Načíst pronájmy
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');

    const filter: any = {};
    if (status && status !== 'all') filter.status = status;

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
        pagination: paginationMeta(page, limit, total),
      }
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/rental error:');
  }
}

// POST - Vytvořit nový pronájem
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);

  try {
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
    const dateError = validateDateRange(startDate, endDate);
    if (dateError) {
      return NextResponse.json({ success: false, message: dateError }, { status: 400 });
    }

    // Kontrola konfliktů s existujícími schválenými žádostmi a potvrzenými pronájmy
    const conflictingRequests = await RentalRequest.find({
      status: 'approved',
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
    });

    const conflictingRentals = await Rental.find({
      status: { $in: ['confirmed', 'paid'] },
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
    });

    if (conflictingRequests.length > 0 || conflictingRentals.length > 0) {
      return NextResponse.json(
        { success: false, message: 'V tomto termínu je hájenka již zarezervována' },
        { status: 409 }
      );
    }

    const rental = new Rental({
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
      status: body.status || 'confirmed',
      price: body.price,
      invoiceId: body.invoiceId,
      adminNotes: body.adminNotes,
      createdBy: tokenUser?.username,
    });

    await rental.save();

    return NextResponse.json({
      success: true,
      message: 'Pronájem byl úspěšně vytvořen',
      data: rental
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ success: false, message: 'Validace selhala', errors }, { status: 400 });
    }
    return dbError(error, 'POST /api/admin/rental error:');
  }
}
