import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Content from '@/models/Content';
import { allPagesContent, siteData, pageContent } from '@/data/content';

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

      // Pokusit se načíst obsah z databáze
      const content = await Content.findOne({ page });

      if (content) {
        return NextResponse.json({
          success: true,
          data: content.content,
          source: 'database',
          lastModified: content.lastModified,
          version: content.version,
        });
      }
    } catch (dbError) {
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
  } catch (error: any) {
    console.error('GET /api/content error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch content', error: error.message },
      { status: 500 }
    );
  }
}