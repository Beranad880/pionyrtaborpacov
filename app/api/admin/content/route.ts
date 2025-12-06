import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Content from '@/models/Content';
import fs from 'fs/promises';
import path from 'path';

// GET - Načíst obsah stránky
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

    await connectToMongoose();

    const content = await Content.findOne({ page });

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    console.error('GET /api/admin/content error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch content', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Uložit nebo aktualizovat obsah stránky
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, content } = body;

    if (!page || !content) {
      return NextResponse.json(
        { success: false, message: 'Page and content are required' },
        { status: 400 }
      );
    }

    await connectToMongoose();

    // Aktualizovat nebo vytvořit obsah
    const savedContent = await Content.findOneAndUpdate(
      { page },
      {
        page,
        content,
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

    // Také aktualizovat soubor content.ts pro statickou dostupnost
    await updateContentFile(page, content);

    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      data: savedContent,
    });
  } catch (error: any) {
    console.error('POST /api/admin/content error:', error);

    // If MongoDB is not available, save to static content file as fallback
    if (error.message?.includes('connect ECONNREFUSED')) {
      try {
        const body = await request.json();
        const { page, content } = body;
        await updateContentFile(page, content);
        return NextResponse.json({
          success: true,
          message: 'Content saved to file (MongoDB offline)',
          data: { page, content, offline: true },
        });
      } catch (fileError) {
        console.error('File save also failed:', fileError);
      }
    }

    return NextResponse.json(
      { success: false, message: 'Failed to save content', error: error.message },
      { status: 500 }
    );
  }
}

// Pomocná funkce pro aktualizaci souboru content.ts
async function updateContentFile(page: string, content: any) {
  try {
    const contentFilePath = path.join(process.cwd(), 'data', 'content.ts');
    let fileContent = await fs.readFile(contentFilePath, 'utf-8');

    // Pro jednoduchost zatím jen logujeme - v produkci by se dalo implementovat
    // pokročilejší nahrazování obsahu v souboru
    console.log(`Content updated for page: ${page}`);
    console.log('New content:', JSON.stringify(content, null, 2));

    // Alternativně můžeme uložit aktuální obsah do backup souboru
    const backupPath = path.join(process.cwd(), 'data', `content-backup-${Date.now()}.json`);
    await fs.writeFile(backupPath, JSON.stringify({ page, content }, null, 2));

  } catch (error) {
    console.error('Failed to update content file:', error);
    // Nechyba - pokračujeme i když se nepodaří aktualizovat soubor
  }
}

// GET ALL - Načíst všechen obsah
export async function PUT(request: NextRequest) {
  try {
    await connectToMongoose();

    const allContent = await Content.find({}).sort({ lastModified: -1 });

    return NextResponse.json({
      success: true,
      data: allContent,
    });
  } catch (error: any) {
    console.error('PUT /api/admin/content error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch all content', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Smazat obsah stránky
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json(
        { success: false, message: 'Page parameter is required' },
        { status: 400 }
      );
    }

    await connectToMongoose();

    const deletedContent = await Content.findOneAndDelete({ page });

    if (!deletedContent) {
      return NextResponse.json(
        { success: false, message: 'Page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
      data: deletedContent,
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/content error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete content', error: error.message },
      { status: 500 }
    );
  }
}