import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import RentalRequest from '@/models/RentalRequest';

// GET - Načíst konkrétní žádost
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongoose();
    const { id } = await params;

    const rentalRequest = await RentalRequest.findById(id);

    if (!rentalRequest) {
      return NextResponse.json(
        { success: false, message: 'Žádost nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rentalRequest
    });
  } catch (error: any) {
    console.error('GET /api/admin/rental-requests/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rental request', error: error.message },
      { status: 500 }
    );
  }
}

// PUT/PATCH - Aktualizovat žádost (změna statusu, poznámky)
async function updateRentalRequest(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongoose();
    const { id } = await params;

    const body = await request.json();

    const rentalRequest = await RentalRequest.findById(id);

    if (!rentalRequest) {
      return NextResponse.json(
        { success: false, message: 'Žádost nebyla nalezena' },
        { status: 404 }
      );
    }

    // Update allowed fields
    if (body.status && ['pending', 'approved', 'rejected'].includes(body.status)) {
      rentalRequest.status = body.status;

      if (body.status !== 'pending') {
        rentalRequest.processedAt = new Date();
        rentalRequest.processedBy = body.processedBy || 'admin';
      }

      // Check for conflicts when approving
      if (body.status === 'approved') {
        const conflictingRequests = await RentalRequest.find({
          _id: { $ne: id },
          status: 'approved',
          $or: [
            {
              startDate: { $lte: rentalRequest.endDate },
              endDate: { $gte: rentalRequest.startDate }
            }
          ]
        });

        if (conflictingRequests.length > 0) {
          return NextResponse.json(
            { success: false, message: 'V tomto termínu je hájenka již zarezervována' },
            { status: 409 }
          );
        }
      }
    }

    if (body.adminNotes !== undefined) {
      rentalRequest.adminNotes = body.adminNotes;
    }

    await rentalRequest.save();

    return NextResponse.json({
      success: true,
      message: 'Žádost byla úspěšně aktualizována',
      data: rentalRequest
    });

  } catch (error: any) {
    console.error('PUT /api/admin/rental-requests/[id] error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update rental request', error: error.message },
      { status: 500 }
    );
  }
}

export const PUT = updateRentalRequest;
export const PATCH = updateRentalRequest;

// DELETE - Smazat žádost
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongoose();
    const { id } = await params;

    const rentalRequest = await RentalRequest.findByIdAndDelete(id);

    if (!rentalRequest) {
      return NextResponse.json(
        { success: false, message: 'Žádost nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Žádost byla úspěšně smazána'
    });

  } catch (error: any) {
    console.error('DELETE /api/admin/rental-requests/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete rental request', error: error.message },
      { status: 500 }
    );
  }
}