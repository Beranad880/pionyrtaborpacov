import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Event from '@/models/Event';
import { requireAuth } from '@/lib/auth-middleware';

// GET - Načíst akce
export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const upcoming = searchParams.get('upcoming');

    const skip = (page - 1) * limit;
    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Event.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error('GET /api/admin/events error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Vytvořit novou akci
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const body = await request.json();

    // Validace required fields
    const requiredFields = ['title', 'description', 'startDate', 'endDate', 'location', 'type', 'organizer'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} je povinný` },
          { status: 400 }
        );
      }
    }

    // Check date validity
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (endDate < startDate) {
      return NextResponse.json(
        { success: false, message: 'Datum konce musí být stejné nebo po datu začátku' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      slug = `${slug}-${Date.now()}`;
    }

    const event = new Event({
      title: body.title,
      slug,
      description: body.description,
      startDate,
      endDate,
      location: body.location,
      type: body.type,
      maxParticipants: body.maxParticipants,
      registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : undefined,
      organizer: body.organizer,
      status: body.status || 'planned',
      isPublic: body.isPublic !== false,
      price: body.price,
      requirements: body.requirements || [],
      equipment: body.equipment || [],
      images: body.images || [],
      ageGroup: body.ageGroup,
    });

    await event.save();

    return NextResponse.json({
      success: true,
      message: 'Akce byla úspěšně vytvořena',
      data: event
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/admin/events error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Akce s tímto názvem již existuje' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create event', error: error.message },
      { status: 500 }
    );
  }
}