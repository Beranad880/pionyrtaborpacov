import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import AdminUser from '@/models/AdminUser';
import Article from '@/models/Article';
import Content from '@/models/Content';
import Facility from '@/models/Facility';
import PioneerGroup from '@/models/PioneerGroup';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

// GET - Stav databáze
export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const [contentPages, pioneerGroups, facilities, articles, adminUsers] = await Promise.all([
      Content.countDocuments(),
      PioneerGroup.countDocuments(),
      Facility.countDocuments(),
      Article.countDocuments(),
      AdminUser.countDocuments(),
    ]);

    const totalCollections = contentPages + pioneerGroups + facilities + articles + adminUsers;

    return NextResponse.json({
      success: true,
      data: {
        databaseConnected: true,
        isInitialized: adminUsers > 0,
        totalCollections,
        contentPages,
        pioneerGroups,
        facilities,
        statistics: 0,
        contacts: 0,
        articles,
        adminUsers,
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        databaseConnected: false,
        isInitialized: false,
        totalCollections: 0,
        contentPages: 0,
        pioneerGroups: 0,
        facilities: 0,
        statistics: 0,
        contacts: 0,
        articles: 0,
        adminUsers: 0,
      },
    });
  }
}

// POST - Inicializace nebo reset databáze
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { action } = body;

    if (!action || !['init', 'reset'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Akce musí být "init" nebo "reset"' },
        { status: 400 }
      );
    }

    await connectToMongoose();

    if (action === 'reset') {
      await Promise.all([
        Content.deleteMany({}),
        PioneerGroup.deleteMany({}),
        Facility.deleteMany({}),
        Article.deleteMany({}),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: action === 'reset' ? 'Databáze byla resetována' : 'Databáze byla inicializována',
    });
  } catch (error) {
    return dbError(error, 'POST /api/admin/init error:');
  }
}
