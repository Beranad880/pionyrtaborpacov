import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Content from '@/models/Content';
import { allPagesContent, siteData, pageContent } from '@/data/content';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

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

      const content = await Content.findOne({ page });

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
        });
      }
    } catch {
      console.log('Database not available, falling back to static content');
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
        modifiedBy: 'admin',
        lastModified: new Date(),
        $inc: { version: 1 }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      data: savedContent,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }
    return dbError(error, 'POST /api/content error:');
  }
}
