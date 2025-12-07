import { NextRequest, NextResponse } from 'next/server';
import { autoInitializeDatabase, resetDatabase } from '@/lib/auto-init';

// POST - Spustí inicializaci databáze
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'reset') {
      await resetDatabase();
      return NextResponse.json({
        success: true,
        message: 'Database reset and reinitialized successfully',
        action: 'reset'
      });
    } else {
      await autoInitializeDatabase();
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        action: 'init'
      });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('POST /api/admin/init error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database initialization failed',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// GET - Zkontroluje stav databáze
export async function GET(request: NextRequest) {
  try {
    const connectToMongoose = (await import('@/lib/mongoose')).default;
    const PioneerGroup = (await import('@/models/PioneerGroup')).default;
    const Facility = (await import('@/models/Facility')).default;
    const PageContent = (await import('@/models/PageContent')).default;
    const Article = (await import('@/models/Article')).default;
    const AdminUser = (await import('@/models/AdminUser')).default;
    const CampApplication = (await import('@/models/CampApplication')).default;
    const RentalRequest = (await import('@/models/RentalRequest')).default;

    await connectToMongoose();

    const [pioneerGroups, facilities, pageContents, articles, adminUsers, campApplications, rentalRequests] = await Promise.all([
      PioneerGroup.countDocuments(),
      Facility.countDocuments(),
      PageContent.countDocuments(),
      Article.countDocuments(),
      AdminUser.countDocuments(),
      CampApplication.countDocuments(),
      RentalRequest.countDocuments(),
    ]);

    const totalCollections = pioneerGroups + facilities + pageContents + articles + adminUsers + campApplications + rentalRequests;

    return NextResponse.json({
      success: true,
      data: {
        contentPages: pageContents,
        pioneerGroups,
        facilities,
        articles,
        adminUsers,
        campApplications,
        rentalRequests,
        totalCollections,
        isInitialized: totalCollections > 0,
        databaseConnected: true
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('GET /api/admin/init error:', error);
    return NextResponse.json({
      success: true,
      data: {
        contentPages: 0,
        pioneerGroups: 0,
        contacts: 0,
        facilities: 0,
        statistics: 0,
        articles: 0,
        adminUsers: 0,
        totalCollections: 0,
        isInitialized: false,
        databaseConnected: false,
        errorMessage: 'MongoDB not available - running in offline mode'
      }
    });
  }
}