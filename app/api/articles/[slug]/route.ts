/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToMongoose from '@/lib/mongoose';
import Article from '@/models/Article';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError, isValidationError, validationError } from '@/lib/api-response';

const isObjectId = (s: string) => mongoose.Types.ObjectId.isValid(s) && /^[0-9a-fA-F]{24}$/.test(s);
const findArticle = (param: string) =>
  isObjectId(param) ? Article.findById(param) : Article.findOne({ slug: param });

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
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);

  try {
    await connectToMongoose();
    const { slug: slugParam } = await params;

    const body = await request.json();
    const { title, slug, content, excerpt, category, tags, status } = body;

    const article = await findArticle(slugParam);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    if (slug && slug !== article.slug) {
      const existingArticle = await Article.findOne({ slug, _id: { $ne: article._id } });
      if (existingArticle) {
        return NextResponse.json(
          { success: false, message: 'Článek s tímto slug již existuje' },
          { status: 409 }
        );
      }
    }

    const updateData: any = { updatedAt: new Date(), processedBy: tokenUser?.username };

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

    const updatedArticle = await Article.findByIdAndUpdate(article._id, updateData, { new: true });

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: 'Článek byl úspěšně aktualizován'
    });

  } catch (error: unknown) {
    if (isValidationError(error)) return validationError(error);
    return dbError(error, 'PUT /api/articles/[slug] error:');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { slug } = await params;

    const article = await findArticle(slug);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    await article.deleteOne();

    return NextResponse.json({ success: true, message: 'Článek byl úspěšně smazán' });

  } catch (error) {
    return dbError(error, 'DELETE /api/articles/[slug] error:');
  }
}
