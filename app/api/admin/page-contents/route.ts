import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PageContent from '@/models/PageContent';
import { requireAuth } from '@/lib/auth-middleware';

// GET - Získat obsah stránek
export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    let query: any = { isActive: true };
    if (pageId) {
      query = { ...query, pageId };
    }

    const pages = await PageContent.find(query).sort({ 'metadata.lastModified': -1 });

    return NextResponse.json({
      success: true,
      data: pageId ? (pages[0] || null) : pages
    });
  } catch (error: any) {
    console.error('GET /api/admin/page-contents error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch page contents',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Vytvořit nový obsah stránky
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const body = await request.json();

    // Zkontrolovat, zda stránka s tímto pageId už existuje
    const existingPage = await PageContent.findOne({ pageId: body.pageId, isActive: true });

    if (existingPage) {
      return NextResponse.json(
        {
          success: false,
          message: 'Page with this pageId already exists'
        },
        { status: 400 }
      );
    }

    const pageContent = new PageContent(body);
    await pageContent.save();

    return NextResponse.json({
      success: true,
      data: pageContent,
      message: 'Page content created successfully'
    });
  } catch (error: any) {
    console.error('POST /api/admin/page-contents error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create page content',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat obsah stránky
export async function PUT(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID is required for update'
        },
        { status: 400 }
      );
    }

    // Automaticky aktualizovat metadata
    updateData.metadata = {
      ...updateData.metadata,
      lastModified: new Date(),
      modifiedBy: updateData.metadata?.modifiedBy || 'admin'
    };

    const pageContent = await PageContent.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!pageContent) {
      return NextResponse.json(
        {
          success: false,
          message: 'Page content not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pageContent,
      message: 'Page content updated successfully'
    });
  } catch (error: any) {
    console.error('PUT /api/admin/page-contents error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update page content',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE - Smazat obsah stránky (soft delete)
export async function DELETE(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID is required for delete'
        },
        { status: 400 }
      );
    }

    const pageContent = await PageContent.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!pageContent) {
      return NextResponse.json(
        {
          success: false,
          message: 'Page content not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Page content deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/page-contents error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete page content',
        error: error.message
      },
      { status: 500 }
    );
  }
}