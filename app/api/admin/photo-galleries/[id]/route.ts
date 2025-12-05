import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PhotoGallery from '@/models/PhotoGallery';

// GET - Načíst konkrétní galerii
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoose();

    const gallery = await PhotoGallery.findById(params.id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gallery
    });
  } catch (error: any) {
    console.error('GET /api/admin/photo-galleries/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch photo gallery', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat galerii
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoose();

    const body = await request.json();

    const gallery = await PhotoGallery.findById(params.id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie nebyla nalezena' },
        { status: 404 }
      );
    }

    // Update fields
    if (body.title) gallery.title = body.title;
    if (body.description) gallery.description = body.description;
    if (body.event) gallery.event = body.event;
    if (body.date) gallery.date = new Date(body.date);
    if (body.coverPhoto) gallery.coverPhoto = body.coverPhoto;
    if (body.isPublic !== undefined) gallery.isPublic = body.isPublic;

    // Handle photos array updates
    if (body.photos) {
      gallery.photos = body.photos;
    }

    await gallery.save();

    return NextResponse.json({
      success: true,
      message: 'Galerie byla úspěšně aktualizována',
      data: gallery
    });

  } catch (error: any) {
    console.error('PUT /api/admin/photo-galleries/[id] error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update photo gallery', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Smazat galerii
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoose();

    const gallery = await PhotoGallery.findByIdAndDelete(params.id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Galerie byla úspěšně smazána'
    });

  } catch (error: any) {
    console.error('DELETE /api/admin/photo-galleries/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete photo gallery', error: error.message },
      { status: 500 }
    );
  }
}