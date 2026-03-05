import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PioneerGroup from '@/models/PioneerGroup';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

// GET - Získat všechny pionýrské oddíly
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const groups = await PioneerGroup.find({ isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: groups });
  } catch (error) {
    return dbError(error, 'GET /api/admin/pioneer-groups error:');
  }
}

// POST - Vytvořit nový pionýrský oddíl
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const body = await request.json();

    const group = new PioneerGroup({
      name: body.name,
      ageRange: body.ageRange,
      description: body.description,
      activities: body.activities || [],
      leader: body.leader,
      meetingDay: body.meetingDay,
      meetingTime: body.meetingTime,
      location: body.location,
      maxMembers: body.maxMembers,
      currentMembers: body.currentMembers || 0,
    });

    await group.save();

    return NextResponse.json({
      success: true,
      data: group,
      message: 'Pioneer group created successfully'
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ success: false, message: errors.join(', ') }, { status: 400 });
    }
    return dbError(error, 'POST /api/admin/pioneer-groups error:');
  }
}

// PUT - Aktualizovat pionýrský oddíl
export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'ID is required for update' },
        { status: 400 }
      );
    }

    const allowedFields = ['name', 'ageRange', 'description', 'activities', 'leader', 'meetingDay', 'meetingTime', 'location', 'maxMembers', 'currentMembers', 'isActive'];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const group = await PioneerGroup.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Pioneer group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: group,
      message: 'Pioneer group updated successfully'
    });
  } catch (error) {
    return dbError(error, 'PUT /api/admin/pioneer-groups error:');
  }
}

// DELETE - Smazat pionýrský oddíl (soft delete)
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
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

    const group = await PioneerGroup.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Pioneer group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Pioneer group deleted successfully' });
  } catch (error) {
    return dbError(error, 'DELETE /api/admin/pioneer-groups error:');
  }
}
