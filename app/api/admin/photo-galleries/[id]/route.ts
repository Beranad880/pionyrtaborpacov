import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PhotoGallery from '@/models/PhotoGallery';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError, isValidationError, validationError } from '@/lib/api-response';

// GET - Načíst konkrétní galerii
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await params;

    const gallery = await PhotoGallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gallery });
  } catch (error) {
    return dbError(error, 'GET /api/admin/photo-galleries/[id] error:');
  }
}

// PUT - Aktualizovat galerii
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);

  try {
    await connectToMongoose();
    const { id } = await params;

    const body = await request.json();
    const gallery = await PhotoGallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie nebyla nalezena' },
        { status: 404 }
      );
    }

    if (body.title) gallery.title = body.title;
    if (body.description) gallery.description = body.description;
    if (body.event) gallery.event = body.event;
    if (body.date) gallery.date = new Date(body.date);
    if (body.coverPhoto) gallery.coverPhoto = body.coverPhoto;
    if (body.isPublic !== undefined) gallery.isPublic = body.isPublic;
    if (body.photos) gallery.photos = body.photos;
    if (tokenUser?.username) gallery.createdBy = tokenUser.username;

    await gallery.save();

    return NextResponse.json({
      success: true,
      message: 'Galerie byla úspěšně aktualizována',
      data: gallery
    });

  } catch (error: unknown) {
    if (isValidationError(error)) return validationError(error);
    return dbError(error, 'PUT /api/admin/photo-galleries/[id] error:');
  }
}

// DELETE - Smazat galerii
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await params;

    const gallery = await PhotoGallery.findByIdAndDelete(id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Galerie byla úspěšně smazána' });

  } catch (error) {
    return dbError(error, 'DELETE /api/admin/photo-galleries/[id] error:');
  }
}
