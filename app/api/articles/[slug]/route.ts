/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Article from '@/models/Article';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToMongoose();
    const { slug } = await params;

    const article = await Article.findOne({ slug, status: 'published' }).lean();

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return dbError(error, 'GET /api/articles/[slug] error:');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { slug: slugParam } = await params;

    const body = await request.json();
    const { title, slug, content, excerpt, category, tags, status } = body;

    const article = await Article.findById(slugParam);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    if (slug && slug !== article.slug) {
      const existingArticle = await Article.findOne({ slug, _id: { $ne: slugParam } });
      if (existingArticle) {
        return NextResponse.json(
          { success: false, message: 'Článek s tímto slug již existuje' },
          { status: 409 }
        );
      }
    }

    const updateData: any = { updatedAt: new Date() };

    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (category) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (status) {
      updateData.status = status;
      if (status === 'published' && !article.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updatedArticle = await Article.findByIdAndUpdate(slugParam, updateData, { new: true });

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: 'Článek byl úspěšně aktualizován'
    });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ success: false, message: errors.join(', ') }, { status: 400 });
    }
    return dbError(error, 'PUT /api/articles/[slug] error:');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { slug } = await params;

    const article = await Article.findByIdAndDelete(slug);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Článek byl úspěšně smazán' });

  } catch (error) {
    return dbError(error, 'DELETE /api/articles/[slug] error:');
  }
}
