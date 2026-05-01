import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToMongoose from '@/lib/mongoose';
import PhotoGallery from '@/models/PhotoGallery';
import { dbError } from '@/lib/api-response';

// GET - Veřejný endpoint pro načtení celé galerie (pouze veřejné galerie)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongoose();
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Neplatné ID galerie' },
        { status: 400 }
      );
    }

    const gallery = await PhotoGallery.findOne({ _id: id, isPublic: true })
      .select({
        title: 1, slug: 1, description: 1, event: 1, date: 1,
        coverPhoto: 1, isPublic: 1, createdAt: 1,
        'photos._id': 1, 'photos.url': 1, 'photos.caption': 1, 'photos.filename': 1,
      })
      .lean();

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie nebyla nalezena' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ success: true, data: gallery });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error) {
    return dbError(error, 'GET /api/photo-galleries/[id] error:');
  }
}
