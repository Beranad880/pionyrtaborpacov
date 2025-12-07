import mongoose, { Document, Schema } from 'mongoose';

export interface IPageContent extends Document {
  pageId: string;
  title: string;
  sections: {
    id: string;
    title: string;
    content: any;
    order: number;
    isVisible: boolean;
  }[];
  metadata: {
    description?: string;
    keywords?: string[];
    lastModified: Date;
    modifiedBy: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    pageId: {
      type: String,
      required: [true, 'ID stránky je povinné'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Nadpis stránky je povinný'],
      trim: true,
      maxlength: [200, 'Nadpis nemůže být delší než 200 znaků'],
    },
    sections: [{
      id: {
        type: String,
        required: [true, 'ID sekce je povinné'],
        trim: true,
      },
      title: {
        type: String,
        required: [true, 'Nadpis sekce je povinný'],
        trim: true,
      },
      content: {
        type: Schema.Types.Mixed,
        required: [true, 'Obsah sekce je povinný'],
      },
      order: {
        type: Number,
        required: [true, 'Pořadí sekce je povinné'],
        min: [0, 'Pořadí nemůže být záporné'],
      },
      isVisible: {
        type: Boolean,
        default: true,
      },
    }],
    metadata: {
      description: {
        type: String,
        maxlength: [500, 'Popis nemůže být delší než 500 znaků'],
      },
      keywords: [{
        type: String,
        trim: true,
        maxlength: [50, 'Klíčové slovo nemůže být delší než 50 znaků'],
      }],
      lastModified: {
        type: Date,
        default: Date.now,
      },
      modifiedBy: {
        type: String,
        default: 'admin',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
// PageContentSchema.index({ pageId: 1 }); // Already unique: true
PageContentSchema.index({ isActive: 1 });
PageContentSchema.index({ 'sections.order': 1 });

// Pre-save middleware to update lastModified
PageContentSchema.pre('save', async function() {
  if (this.isModified('sections')) {
    this.metadata.lastModified = new Date();
  }
});

export default mongoose.models.PageContent || mongoose.model<IPageContent>('PageContent', PageContentSchema);