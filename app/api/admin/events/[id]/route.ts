import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Event from '@/models/Event';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { validateDateRange } from '@/lib/validation';
import { dbError } from '@/lib/api-response';

// GET - Načíst konkrétní akci
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
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

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return dbError(error, 'GET /api/admin/events/[id] error:');
  }
}

// PUT - Aktualizovat akci
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);

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

    if (body.title) event.title = body.title;
    if (body.description) event.description = body.description;
    if (body.location) event.location = body.location;
    if (body.type) event.type = body.type;
    if (body.organizer) event.organizer = body.organizer;
    if (body.status) event.status = body.status;

    if (body.startDate) event.startDate = new Date(body.startDate);

    if (body.endDate) {
      const endDate = new Date(body.endDate);
      const dateError = validateDateRange(event.startDate, endDate);
      if (dateError) {
        return NextResponse.json({ success: false, message: dateError }, { status: 400 });
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
    if (tokenUser?.username) event.modifiedBy = tokenUser.username;

    await event.save();

    return NextResponse.json({
      success: true,
      message: 'Akce byla úspěšně aktualizována',
      data: event
    });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ success: false, message: 'Validace selhala', errors }, { status: 400 });
    }
    return dbError(error, 'PUT /api/admin/events/[id] error:');
  }
}

// DELETE - Smazat akci
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
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

    return NextResponse.json({ success: true, message: 'Akce byla úspěšně smazána' });

  } catch (error) {
    return dbError(error, 'DELETE /api/admin/events/[id] error:');
  }
}
