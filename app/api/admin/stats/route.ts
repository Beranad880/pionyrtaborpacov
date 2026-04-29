import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Article from '@/models/Article';
import Event from '@/models/Event';
import Content from '@/models/Content';
import CampApplication from '@/models/CampApplication';
import RentalRequest from '@/models/RentalRequest';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const [
      pagesCount,
      articlesCount,
      upcomingEventsCount,
      pendingCampApps,
      pendingRentalReqs,
      siteData
    ] = await Promise.all([
      Content.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      Event.countDocuments({ startDate: { $gte: new Date() }, status: { $ne: 'cancelled' } }),
      CampApplication.countDocuments({ status: 'pending', isDeleted: { $ne: true } }),
      RentalRequest.countDocuments({ status: 'pending', isDeleted: { $ne: true } }),
      Content.findOne({ page: 'siteData' }).select('content.statistics.total').lean()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        pages: pagesCount,
        articles: articlesCount,
        upcomingEvents: upcomingEventsCount,
        members: (siteData as any)?.content?.statistics?.total || 0,
        pendingCampApplications: pendingCampApps,
        pendingRentalRequests: pendingRentalReqs,
      }
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/stats error:');
  }
}
