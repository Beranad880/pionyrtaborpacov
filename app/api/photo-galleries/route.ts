import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PhotoGallery from '@/models/PhotoGallery';
import { parsePagination, paginationMeta } from '@/lib/pagination';
import { dbError } from '@/lib/api-response';

// GET - Veřejný výpis galerií (jen veřejné, max 8 náhledových fotek na galerii)
export async function GET(request: NextRequest) {
  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams, 12);

    const filter = { isPublic: true };

    const [galleries, total] = await Promise.all([
      PhotoGallery.aggregate([
        { $match: filter },
        { $sort: { date: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $addFields: {
            photosCount: { $size: '$photos' },
            photos: { $slice: ['$photos', 8] },
          },
        },
        {
          $project: {
            title: 1, slug: 1, description: 1, event: 1, date: 1,
            coverPhoto: 1, isPublic: 1, photosCount: 1, createdAt: 1,
            'photos._id': 1, 'photos.url': 1, 'photos.caption': 1, 'photos.filename': 1,
          },
        },
      ]),
      PhotoGallery.countDocuments(filter),
    ]);

    const response = NextResponse.json({
      success: true,
      data: {
        galleries,
        pagination: paginationMeta(page, limit, total),
      },
    });

    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error) {
    return dbError(error, 'GET /api/photo-galleries error:');
  }
}
