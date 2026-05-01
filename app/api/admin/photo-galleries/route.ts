import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PhotoGallery from '@/models/PhotoGallery';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { parsePagination, paginationMeta } from '@/lib/pagination';
import { uniqueSlug } from '@/lib/slug';
import { dbError, isValidationError, validationError, isDuplicateKeyError } from '@/lib/api-response';

// GET - Načíst fotogalerie
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isPublicParam = searchParams.get('isPublic');

  // Vyžadovat auth pouze pokud se nepožadují veřejné galerie
  if (isPublicParam !== 'true') {
    const authError = await requireAuth(request);
    if (authError) return authError;
  }

  try {
    await connectToMongoose();

    const { page, limit, skip } = parsePagination(searchParams, 12);

    const filter: any = {};
    if (isPublicParam === 'true') filter.isPublic = true;
    else if (isPublicParam === 'false') filter.isPublic = false;

    const [galleries, total] = await Promise.all([
      PhotoGallery.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PhotoGallery.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        galleries,
        pagination: paginationMeta(page, limit, total),
      },
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/photo-galleries error:');
  }
}

// POST - Vytvořit novou galerii
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);

  try {
    await connectToMongoose();

    const body = await request.json();

    const requiredFields = ['title', 'description', 'event', 'date'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} je povinný` },
          { status: 400 }
        );
      }
    }

    const parsedDate = new Date(body.date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Neplatný formát data' },
        { status: 400 }
      );
    }

    const slug = await uniqueSlug(PhotoGallery, body.title);

    const gallery = new PhotoGallery({
      title: body.title,
      slug,
      description: body.description,
      event: body.event,
      date: parsedDate,
      photos: body.photos || [],
      coverPhoto: body.coverPhoto,
      isPublic: body.isPublic !== false,
      createdBy: tokenUser?.username ?? body.createdBy,
    });

    await gallery.save();

    return NextResponse.json({
      success: true,
      message: 'Galerie byla úspěšně vytvořena',
      data: gallery
    }, { status: 201 });

  } catch (error: unknown) {
    if (isValidationError(error)) return validationError(error);
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { success: false, message: 'Galerie s tímto názvem již existuje' },
        { status: 409 }
      );
    }
    return dbError(error, 'POST /api/admin/photo-galleries error:');
  }
}
