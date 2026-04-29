import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Content from '@/models/Content';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';
import { logAction } from '@/lib/audit';

// GET - Načíst seznam všech stránek s obsahem
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const contents = await Content.find()
      .select('page lastModified version modifiedBy')
      .sort({ page: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: contents,
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/content error:');
  }
}

// PUT - Alternativní GET pro všechny stránky (podle ADMIN_PANEL_GUIDE.md)
export async function PUT(request: NextRequest) {
  return GET(request);
}

// POST - Uložit obsah
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const user = await getUserFromToken(request);

  try {
    const body = await request.json();
    const { page, data } = body;

    if (!page || !data) {
      return NextResponse.json(
        { success: false, message: 'Page and data are required' },
        { status: 400 }
      );
    }

    await connectToMongoose();

    const savedContent = await Content.findOneAndUpdate(
      { page },
      {
        page,
        content: data,
        modifiedBy: user?.username || 'admin',
        lastModified: new Date(),
        $inc: { version: 1 }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    const pageLabels: Record<string, string> = {
      home: 'Úvodní stránka',
      siteData: 'Kontaktní údaje a nastavení webu',
      rentalSettings: 'Ceník a nastavení pronájmu',
    };

    logAction({
      action: 'Úprava obsahu stránky (admin)',
      entity: 'content',
      entityId: savedContent._id?.toString(),
      entityTitle: pageLabels[page] || page,
      user: user?.username || 'admin',
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      data: savedContent,
    });
  } catch (error: unknown) {
    return dbError(error, 'POST /api/admin/content error:');
  }
}
