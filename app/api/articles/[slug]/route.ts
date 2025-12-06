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

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Kontrola autentifikace
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoose();

    const body = await request.json();
    const { title, slug, content, excerpt, category, tags, status } = body;

    // Find article by ID (assuming slug param is actually an ID in admin context)
    const article = await Article.findById(params.slug);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if new slug already exists (if slug is being changed)
    if (slug && slug !== article.slug) {
      const existingArticle = await Article.findOne({ slug, _id: { $ne: params.slug } });
      if (existingArticle) {
        return NextResponse.json(
          { success: false, message: 'Článek s tímto slug již existuje' },
          { status: 409 }
        );
      }
    }

    // Update article
    const updateData: any = {
      updatedAt: new Date()
    };

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

    const updatedArticle = await Article.findByIdAndUpdate(
      params.slug,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: 'Článek byl úspěšně aktualizován'
    });

  } catch (error: any) {
    console.error('PUT /api/articles/[slug] error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Chyba při aktualizaci článku', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Kontrola autentifikace
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoose();

    // Find and delete article by ID
    const article = await Article.findByIdAndDelete(params.slug);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Článek byl úspěšně smazán'
    });

  } catch (error: any) {
    console.error('DELETE /api/articles/[slug] error:', error);
    return NextResponse.json(
      { success: false, message: 'Chyba při mazání článku', error: error.message },
      { status: 500 }
    );
  }
}