import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Rental, { IRental } from '@/models/Rental';
import RentalRequest from '@/models/RentalRequest';

// GET - Načíst konkrétní pronájem
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const rental = await Rental.findById(params.id);

    if (!rental) {
      return NextResponse.json(
        { success: false, message: 'Pronájem nebyl nalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rental
    });
  } catch (error: any) {
    console.error('GET /api/admin/rental/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rental', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat pronájem
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const rental = await Rental.findById(params.id);

    if (!rental) {
      return NextResponse.json(
        { success: false, message: 'Pronájem nebyl nalezen' },
        { status: 404 }
      );
    }

    const startDate = body.startDate ? new Date(body.startDate) : rental.startDate;
    const endDate = body.endDate ? new Date(body.endDate) : rental.endDate;

    if (endDate <= startDate) {
        return NextResponse.json(
          { success: false, message: 'Datum odjezdu musí být po datu příjezdu' },
          { status: 400 }
        );
    }
    
    // Check for conflicts when updating dates
    if (body.startDate || body.endDate) {
      const conflictingRequests = await RentalRequest.find({
        status: 'approved',
        $or: [
          { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
      });
  
      const conflictingRentals = await Rental.find({
        _id: { $ne: params.id },
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
    }

    // Update fields
    const allowedFields: (keyof IRental)[] = ['name', 'email', 'phone', 'organization', 'startDate', 'endDate', 'guestCount', 'purpose', 'facilities', 'message', 'status', 'price', 'invoiceId', 'adminNotes'];
    
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
    console.error('PUT /api/admin/rental/[id] error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update rental', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Smazat pronájem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const rental = await Rental.findByIdAndDelete(params.id);

    if (!rental) {
      return NextResponse.json(
        { success: false, message: 'Pronájem nebyl nalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pronájem byl úspěšně smazán'
    });

  } catch (error: any) {
    console.error('DELETE /api/admin/rental/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete rental', error: error.message },
      { status: 500 }
    );
  }
}
