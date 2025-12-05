import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PioneerGroup from '@/models/PioneerGroup';

// GET - Získat všechny pionýrské oddíly
export async function GET() {
  try {
    await connectToMongoose();
    const groups = await PioneerGroup.find({ isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: groups
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('GET /api/admin/pioneer-groups error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch pioneer groups',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Vytvořit nový pionýrský oddíl
export async function POST(request: NextRequest) {
  try {
    await connectToMongoose();
    const body = await request.json();

    const group = new PioneerGroup(body);
    await group.save();

    return NextResponse.json({
      success: true,
      data: group,
      message: 'Pioneer group created successfully'
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('POST /api/admin/pioneer-groups error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create pioneer group',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat pionýrský oddíl
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

    const group = await PioneerGroup.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pioneer group not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: group,
      message: 'Pioneer group updated successfully'
    });
  } catch (error: any) {
    console.error('PUT /api/admin/pioneer-groups error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update pioneer group',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE - Smazat pionýrský oddíl (soft delete)
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

    const group = await PioneerGroup.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pioneer group not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pioneer group deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/pioneer-groups error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete pioneer group',
        error: error.message
      },
      { status: 500 }
    );
  }
}