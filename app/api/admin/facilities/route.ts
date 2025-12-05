import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Facility from '@/models/Facility';

// GET - Získat všechna zařízení
export async function GET() {
  try {
    await connectToMongoose();
    const facilities = await Facility.find({ isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: facilities
    });
  } catch (error: any) {
    console.error('GET /api/admin/facilities error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch facilities',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Vytvořit nové zařízení
export async function POST(request: NextRequest) {
  try {
    await connectToMongoose();
    const body = await request.json();

    const facility = new Facility(body);
    await facility.save();

    return NextResponse.json({
      success: true,
      data: facility,
      message: 'Facility created successfully'
    });
  } catch (error: any) {
    console.error('POST /api/admin/facilities error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create facility',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat zařízení
export async function PUT(request: NextRequest) {
  try {
    await connectToMongoose();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID is required for update'
        },
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
        {
          success: false,
          message: 'Facility not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: facility,
      message: 'Facility updated successfully'
    });
  } catch (error: any) {
    console.error('PUT /api/admin/facilities error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update facility',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE - Smazat zařízení (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    await connectToMongoose();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID is required for delete'
        },
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
        {
          success: false,
          message: 'Facility not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/facilities error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete facility',
        error: error.message
      },
      { status: 500 }
    );
  }
}