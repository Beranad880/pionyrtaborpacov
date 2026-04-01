import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Content from '@/models/Content';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

// GET - Načíst obsah stránky
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

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

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return dbError(error, 'GET /api/admin/content error:');
  }
}

// POST - Uložit nebo aktualizovat obsah stránky
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);

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

    const savedContent = await Content.findOneAndUpdate(
      { page },
      {
        page,
        content,
        modifiedBy: tokenUser?.username ?? 'admin',
        lastModified: new Date(),
        $inc: { version: 1 }
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      data: savedContent,
    });
  } catch (error: any) {
    return dbError(error, 'POST /api/admin/content error:');
  }
}

// PUT - Načíst všechen obsah
export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const allContent = await Content.find({}).sort({ lastModified: -1 });
    return NextResponse.json({ success: true, data: allContent });
  } catch (error) {
    return dbError(error, 'PUT /api/admin/content error:');
  }
}

// DELETE - Smazat obsah stránky
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

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
  } catch (error) {
    return dbError(error, 'DELETE /api/admin/content error:');
  }
}

