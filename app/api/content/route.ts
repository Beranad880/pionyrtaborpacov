import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Content from '@/models/Content';
import { allPagesContent, siteData, pageContent } from '@/data/content';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError, isValidationError, validationError } from '@/lib/api-response';
import { logAction } from '@/lib/audit';

// GET - Načíst obsah stránky (pro frontend)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json(
        { success: false, message: 'Page parameter is required' },
        { status: 400 }
      );
    }

    try {
      await connectToMongoose();

      const content = await Content.findOne({ page }).lean();

      if (content) {
        let data = content.content;
        if (page === 'siteData' && Array.isArray(data?.menu)) {
          const removed = ['aktuality-2026', 'rok-2026'];
          data = { ...data, menu: data.menu.filter((item: any) => !removed.some(r => item.href?.includes(r))) };
        }
        
        return NextResponse.json({
          success: true,
          data,
          source: 'database',
          lastModified: content.lastModified,
          version: content.version,
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
          }
        });
      }
    } catch {
      // DB nedostupná, fallback na statický obsah
    }

    // Fallback na statický obsah ze souboru
    let staticContent;

    switch (page) {
      case 'home':
        staticContent = {
          ...pageContent,
          hero: allPagesContent.home.hero
        };
        break;
      case 'siteData':
        staticContent = siteData;
        break;
      default:
        staticContent = (allPagesContent as any)[page];
        break;
    }

    if (!staticContent) {
      return NextResponse.json(
        { success: false, message: 'Page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: staticContent,
      source: 'static',
    });
  } catch (error) {
    return dbError(error, 'GET /api/content error:');
  }
}

// POST - Uložit nebo aktualizovat obsah stránky (pouze admin)
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
      pioneerGroups: 'Pionýrské oddíly',
    };

    logAction({
      action: 'Úprava obsahu stránky',
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
    if (isValidationError(error)) return validationError(error);
    return dbError(error, 'POST /api/content error:');
  }
}
