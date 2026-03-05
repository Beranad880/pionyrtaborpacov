import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Facility from '@/models/Facility';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

// GET - Získat všechna zařízení
export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const facilities = await Facility.find({ isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: facilities });
  } catch (error) {
    return dbError(error, 'GET /api/admin/facilities error:');
  }
}

// POST - Vytvořit nové zařízení
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const body = await request.json();

    const facility = new Facility({
      name: body.name,
      type: body.type,
      description: body.description,
      details: body.details,
      location: body.location,
      equipment: body.equipment || [],
      activities: body.activities || [],
      capacity: body.capacity,
      images: body.images || [],
      contact: body.contact,
      rental: body.rental,
    });

    await facility.save();

    return NextResponse.json({
      success: true,
      data: facility,
      message: 'Facility created successfully'
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ success: false, message: errors.join(', ') }, { status: 400 });
    }
    return dbError(error, 'POST /api/admin/facilities error:');
  }
}

// PUT - Aktualizovat zařízení
export async function PUT(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'ID is required for update' },
        { status: 400 }
      );
    }

    const facility = await Facility.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!facility) {
      return NextResponse.json(
        { success: false, message: 'Facility not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: facility,
      message: 'Facility updated successfully'
    });
  } catch (error) {
    return dbError(error, 'PUT /api/admin/facilities error:');
  }
}

// DELETE - Smazat zařízení (soft delete)
export async function DELETE(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID is required for delete' },
        { status: 400 }
      );
    }

    const facility = await Facility.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!facility) {
      return NextResponse.json(
        { success: false, message: 'Facility not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Facility deleted successfully' });
  } catch (error) {
    return dbError(error, 'DELETE /api/admin/facilities error:');
  }
}
