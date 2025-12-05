import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Article from '@/models/Article';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToMongoose();

    const article = await Article.findOne({
      slug: params.slug,
      status: 'published'
    })
      .lean();

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    // Increment views
    await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

    return NextResponse.json({
      success: true,
      data: article
    });
  } catch (error: any) {
    console.error('GET /api/articles/[slug] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch article', error: error.message },
      { status: 500 }
    );
  }
}