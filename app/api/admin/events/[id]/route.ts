import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Event from '@/models/Event';
import { requireAuth } from '@/lib/auth-middleware';

// GET - Načíst konkrétní akci
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await context.params;

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Akce nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error: any) {
    console.error('GET /api/admin/events/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat akci
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await context.params;

    const body = await request.json();

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Akce nebyla nalezena' },
        { status: 404 }
      );
    }

    // Update fields
    if (body.title) event.title = body.title;
    if (body.description) event.description = body.description;
    if (body.location) event.location = body.location;
    if (body.type) event.type = body.type;
    if (body.organizer) event.organizer = body.organizer;
    if (body.status) event.status = body.status;

    if (body.startDate) {
      const startDate = new Date(body.startDate);
      event.startDate = startDate;
    }

    if (body.endDate) {
      const endDate = new Date(body.endDate);
      if (endDate < event.startDate) {
        return NextResponse.json(
          { success: false, message: 'Datum konce musí být stejné nebo po datu začátku' },
          { status: 400 }
        );
      }
      event.endDate = endDate;
    }

    if (body.maxParticipants !== undefined) event.maxParticipants = body.maxParticipants;
    if (body.registrationDeadline) event.registrationDeadline = new Date(body.registrationDeadline);
    if (body.isPublic !== undefined) event.isPublic = body.isPublic;
    if (body.price !== undefined) event.price = body.price;
    if (body.requirements) event.requirements = body.requirements;
    if (body.equipment) event.equipment = body.equipment;
    if (body.images) event.images = body.images;
    if (body.ageGroup) event.ageGroup = body.ageGroup;

    await event.save();

    return NextResponse.json({
      success: true,
      message: 'Akce byla úspěšně aktualizována',
      data: event
    });

  } catch (error: any) {
    console.error('PUT /api/admin/events/[id] error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update event', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Smazat akci
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await context.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Akce nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Akce byla úspěšně smazána'
    });

  } catch (error: any) {
    console.error('DELETE /api/admin/events/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete event', error: error.message },
      { status: 500 }
    );
  }
}