import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Article from '@/models/Article';

export async function GET(request: NextRequest) {
  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    if (slug) {
      // Get specific article by slug
      const article = await Article.findOne({ slug, status: 'published' })
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
    }

    // Get articles list
    const skip = (page - 1) * limit;
    const filter: any = { status: 'published' };

    if (category) {
      filter.category = category;
    }

    // Pro admin requesty (s auth cookie) vrať všechny články
    const authCookie = request.cookies.get('admin_auth');
    let articlesQuery;

    if (authCookie) {
      // Admin může vidět všechny články včetně draft a archived
      const adminFilter: any = {};
      if (category) adminFilter.category = category;

      const status = new URL(request.url).searchParams.get('status');
      if (status && status !== 'all') {
        adminFilter.status = status;
      }

      articlesQuery = Article.find(adminFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } else {
      // Public může vidět jen published články
      articlesQuery = Article.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug excerpt author category tags publishedAt views likes')
        .lean();
    }

    const articles = await articlesQuery;

    const total = authCookie
      ? await Article.countDocuments(authCookie ? {} : filter)
      : await Article.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        articles,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error('GET /api/articles error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch articles', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Kontrola autentifikace pro admin operace
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoose();

    const body = await request.json();
    const { title, slug, content, excerpt, author, category, tags, status } = body;

    // Validate required fields
    if (!title || !slug || !content || !excerpt || !category) {
      return NextResponse.json(
        { success: false, message: 'Chybí povinná pole' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingArticle = await Article.findOne({ slug });
    if (existingArticle) {
      return NextResponse.json(
        { success: false, message: 'Článek s tímto slug již existuje' },
        { status: 409 }
      );
    }

    // Create new article without author reference for now
    const article = new Article({
      title,
      slug,
      content,
      excerpt,
      author: author || 'Admin',
      category,
      tags: tags || [],
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : undefined
    });

    await article.save();

    return NextResponse.json({
      success: true,
      data: article,
      message: 'Článek byl úspěšně vytvořen'
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/articles error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Článek s tímto slug již existuje' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Chyba při vytváření článku', error: error.message },
      { status: 500 }
    );
  }
}