import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PhotoGallery from '@/models/PhotoGallery';
import { requireAuth } from '@/lib/auth-middleware';

// GET - Načíst fotogalerie
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isPublicParam = searchParams.get('isPublic');

  // Vyžadovat auth pouze pokud se nepožadují veřejné galerie
  if (isPublicParam !== 'true') {
    const authError = requireAuth(request);
    if (authError) return authError;
  }

  try {
    await connectToMongoose();

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const isPublic = isPublicParam;

    const skip = (page - 1) * limit;
    const filter: any = {};

    if (isPublic === 'true') {
      filter.isPublic = true;
    } else if (isPublic === 'false') {
      filter.isPublic = false;
    }

    const galleries = await PhotoGallery.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await PhotoGallery.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        galleries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error('GET /api/admin/photo-galleries error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch photo galleries', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Vytvořit novou galerii
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const body = await request.json();

    // Validace required fields
    const requiredFields = ['title', 'description', 'event', 'date', 'createdBy'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} je povinný` },
          { status: 400 }
        );
      }
    }

    // Generate unique slug
    let slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const existingGallery = await PhotoGallery.findOne({ slug });
    if (existingGallery) {
      slug = `${slug}-${Date.now()}`;
    }

    const gallery = new PhotoGallery({
      title: body.title,
      slug,
      description: body.description,
      event: body.event,
      date: new Date(body.date),
      photos: body.photos || [],
      coverPhoto: body.coverPhoto,
      isPublic: body.isPublic !== false,
      createdBy: body.createdBy,
    });

    await gallery.save();

    return NextResponse.json({
      success: true,
      message: 'Galerie byla úspěšně vytvořena',
      data: gallery
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/admin/photo-galleries error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Galerie s tímto názvem již existuje' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create photo gallery', error: error.message },
      { status: 500 }
    );
  }
}