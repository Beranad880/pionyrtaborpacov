import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'news' | 'event-report' | 'general' | 'announcement';
  tags: string[];
  featuredImage?: string;
  images?: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  views: number;
  likes: number;
  comments: {
    author: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Nadpis článku je povinný'],
      trim: true,
      maxlength: [150, 'Nadpis článku nemůže být delší než 150 znaků'],
    },
    slug: {
      type: String,
      required: [true, 'URL slug je povinný'],
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug může obsahovat pouze malá písmena, čísla a pomlčky'],
    },
    content: {
      type: String,
      required: [true, 'Obsah článku je povinný'],
    },
    excerpt: {
      type: String,
      required: [true, 'Výtah článku je povinný'],
      maxlength: [300, 'Výtah článku nemůže být delší než 300 znaků'],
    },
    author: {
      type: String,
      required: [true, 'Autor článku je povinný'],
    },
    category: {
      type: String,
      enum: ['news', 'event-report', 'general', 'announcement'],
      required: [true, 'Kategorie článku je povinná'],
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [30, 'Tag nemůže být delší než 30 znaků'],
    }],
    featuredImage: String,
    images: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: Date,
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: [{
      author: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
        maxlength: [500, 'Komentář nemůže být delší než 500 znaků'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ status: 1 });
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ tags: 1 });

// Pre-save middleware to set publishedAt when status changes to published
ArticleSchema.pre('save', async function() {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);