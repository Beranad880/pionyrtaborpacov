import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PhotoGallery from '@/models/PhotoGallery';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

export const maxDuration = 30;

// POST - Přidat jednu fotku do galerie
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);

  try {
    await connectToMongoose();
    const { id } = await params;
    const photo = await request.json();

    if (!photo.url || !photo.filename) {
      return NextResponse.json(
        { success: false, message: 'Chybí URL nebo název souboru fotky' },
        { status: 400 }
      );
    }

    const updatedGallery = await PhotoGallery.findByIdAndUpdate(
      id,
      { 
        $push: { photos: { ...photo, uploadedBy: tokenUser?.username || 'admin', uploadedAt: new Date() } }
      },
      { new: true, runValidators: true }
    );

    if (!updatedGallery) {
      return NextResponse.json(
        { success: false, message: 'Galerie nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Fotka byla přidána',
      data: updatedGallery.photos[updatedGallery.photos.length - 1]
    });

  } catch (error: unknown) {
    return dbError(error, 'POST /api/admin/photo-galleries/[id]/photos error:');
  }
}
