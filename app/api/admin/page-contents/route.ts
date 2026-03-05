import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import PageContent from '@/models/PageContent';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

// GET - Získat obsah stránek
export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    const query: any = { isActive: true };
    if (pageId) query.pageId = pageId;

    const pages = await PageContent.find(query).sort({ 'metadata.lastModified': -1 });

    return NextResponse.json({
      success: true,
      data: pageId ? (pages[0] || null) : pages
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/page-contents error:');
  }
}

// POST - Vytvořit nový obsah stránky
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const body = await request.json();

    const existingPage = await PageContent.findOne({ pageId: body.pageId, isActive: true });

    if (existingPage) {
      return NextResponse.json(
        { success: false, message: 'Page with this pageId already exists' },
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
  } catch (error) {
    return dbError(error, 'POST /api/admin/page-contents error:');
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
        { success: false, message: 'ID is required for update' },
        { status: 400 }
      );
    }

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
        { success: false, message: 'Page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pageContent,
      message: 'Page content updated successfully'
    });
  } catch (error) {
    return dbError(error, 'PUT /api/admin/page-contents error:');
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
        { success: false, message: 'ID is required for delete' },
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
        { success: false, message: 'Page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Page content deleted successfully' });
  } catch (error) {
    return dbError(error, 'DELETE /api/admin/page-contents error:');
  }
}
