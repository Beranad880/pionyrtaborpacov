import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Statistics from '@/models/Statistics';

// GET - Získat všechny statistiky
export async function GET(request: NextRequest) {
  try {
    await connectToMongoose();
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    let query = { isActive: true };
    if (year) {
      query = { ...query, year: parseInt(year) };
    }

    const statistics = await Statistics.find(query).sort({ year: -1 });

    return NextResponse.json({
      success: true,
      data: statistics
    });
  } catch (error: any) {
    console.error('GET /api/admin/statistics error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Vytvořit nové statistiky
export async function POST(request: NextRequest) {
  try {
    await connectToMongoose();
    const body = await request.json();

    const statistics = new Statistics(body);
    await statistics.save();

    return NextResponse.json({
      success: true,
      data: statistics,
      message: 'Statistics created successfully'
    });
  } catch (error: any) {
    console.error('POST /api/admin/statistics error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create statistics',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat statistiky
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

    const statistics = await Statistics.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!statistics) {
      return NextResponse.json(
        {
          success: false,
          message: 'Statistics not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: statistics,
      message: 'Statistics updated successfully'
    });
  } catch (error: any) {
    console.error('PUT /api/admin/statistics error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update statistics',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE - Smazat statistiky (soft delete)
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

    const statistics = await Statistics.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!statistics) {
      return NextResponse.json(
        {
          success: false,
          message: 'Statistics not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Statistics deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/statistics error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete statistics',
        error: error.message
      },
      { status: 500 }
    );
  }
}