import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Rental, { IRental } from '@/models/Rental';
import RentalRequest from '@/models/RentalRequest';
import { requireAuth } from '@/lib/auth-middleware';
import { validateDateRange } from '@/lib/validation';
import { dbError } from '@/lib/api-response';

// GET - Načíst konkrétní pronájem
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await params;

    const rental = await Rental.findById(id);

    if (!rental) {
      return NextResponse.json(
        { success: false, message: 'Pronájem nebyl nalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rental });
  } catch (error) {
    return dbError(error, 'GET /api/admin/rental/[id] error:');
  }
}

// PUT - Aktualizovat pronájem
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await params;

    const body = await request.json();
    const rental = await Rental.findById(id);

    if (!rental) {
      return NextResponse.json(
        { success: false, message: 'Pronájem nebyl nalezen' },
        { status: 404 }
      );
    }

    const startDate = body.startDate ? new Date(body.startDate) : rental.startDate;
    const endDate = body.endDate ? new Date(body.endDate) : rental.endDate;

    const dateError = validateDateRange(startDate, endDate);
    if (dateError) {
      return NextResponse.json({ success: false, message: dateError }, { status: 400 });
    }

    // Kontrola konfliktů při změně termínu
    if (body.startDate || body.endDate) {
      const conflictingRequests = await RentalRequest.find({
        status: 'approved',
        $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
      });

      const conflictingRentals = await Rental.find({
        _id: { $ne: id },
        status: { $in: ['confirmed', 'paid'] },
        $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
      });

      if (conflictingRequests.length > 0 || conflictingRentals.length > 0) {
        return NextResponse.json(
          { success: false, message: 'V tomto termínu je hájenka již zarezervována' },
          { status: 409 }
        );
      }
    }

    const allowedFields: (keyof IRental)[] = [
      'name', 'email', 'phone', 'organization', 'startDate', 'endDate',
      'guestCount', 'purpose', 'facilities', 'message', 'status',
      'price', 'invoiceId', 'adminNotes'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (rental as any)[field] = body[field];
      }
    }

    await rental.save();

    return NextResponse.json({
      success: true,
      message: 'Pronájem byl úspěšně aktualizován',
      data: rental
    });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ success: false, message: 'Validace selhala', errors }, { status: 400 });
    }
    return dbError(error, 'PUT /api/admin/rental/[id] error:');
  }
}

// DELETE - Smazat pronájem
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await params;

    const rental = await Rental.findByIdAndDelete(id);

    if (!rental) {
      return NextResponse.json(
        { success: false, message: 'Pronájem nebyl nalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Pronájem byl úspěšně smazán' });

  } catch (error) {
    return dbError(error, 'DELETE /api/admin/rental/[id] error:');
  }
}
