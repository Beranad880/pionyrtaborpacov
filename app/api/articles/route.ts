import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Article from '@/models/Article';
import { requireAuth } from '@/lib/auth-middleware';
import { parsePagination, paginationMeta } from '@/lib/pagination';
import { dbError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const { page, limit, skip } = parsePagination(searchParams);
    const category = searchParams.get('category');

    if (slug) {
      const article = await Article.findOne({ slug, status: 'published' }).lean();

      if (!article) {
        return NextResponse.json(
          { success: false, message: 'Article not found' },
          { status: 404 }
        );
      }

      await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

      return NextResponse.json({ success: true, data: article });
    }

    // Ověřit auth cookie pro admin přístup
    const authCookie = request.cookies.get('admin_auth');
    const isAdmin = authCookie && requireAuth(request) === null;

    let filter: any = isAdmin ? {} : { status: 'published' };
    if (category) filter.category = category;

    if (isAdmin) {
      const status = searchParams.get('status');
      if (status && status !== 'all') filter.status = status;
    }

    const query = Article.find(filter)
      .sort(isAdmin ? { createdAt: -1 } : { publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!isAdmin) {
      query.select('title slug excerpt author category tags publishedAt views likes');
    }

    const articles = await query.lean();

    const total = await Article.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        articles,
        pagination: paginationMeta(page, limit, total),
      }
    });
  } catch (error) {
    return dbError(error, 'GET /api/articles error:');
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const body = await request.json();
    const { title, slug, content, excerpt, author, category, tags, status } = body;

    if (!title || !slug || !content || !excerpt || !category) {
      return NextResponse.json(
        { success: false, message: 'Chybí povinná pole' },
        { status: 400 }
      );
    }

    const existingArticle = await Article.findOne({ slug });
    if (existingArticle) {
      return NextResponse.json(
        { success: false, message: 'Článek s tímto slug již existuje' },
        { status: 409 }
      );
    }

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
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ success: false, message: errors.join(', ') }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Článek s tímto slug již existuje' },
        { status: 409 }
      );
    }
    return dbError(error, 'POST /api/articles error:');
  }
}
