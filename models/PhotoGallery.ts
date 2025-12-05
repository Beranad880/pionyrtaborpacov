import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  filename: string;
  url: string;
  caption?: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: Date;
}

export interface IPhotoGallery extends Document {
  title: string;
  slug: string;
  description: string;
  event: string;
  date: Date;
  photos: IPhoto[];
  coverPhoto?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhoto>({
  filename: {
    type: String,
    required: [true, 'Název souboru je povinný'],
    trim: true,
    maxlength: [255, 'Název souboru nemůže být delší než 255 znaků'],
  },
  url: {
    type: String,
    required: [true, 'URL fotky je povinná'],
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i, 'Neplatná URL fotky'],
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [500, 'Popis fotky nemůže být delší než 500 znaků'],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag nemůže být delší než 50 znaků'],
  }],
  uploadedBy: {
    type: String,
    required: [true, 'Údaj o nahrání je povinný'],
    trim: true,
    maxlength: [100, 'Jméno nahrávajícího nemůže být delší než 100 znaků'],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const PhotoGallerySchema = new Schema<IPhotoGallery>(
  {
    title: {
      type: String,
      required: [true, 'Název galerie je povinný'],
      trim: true,
      maxlength: [200, 'Název galerie nemůže být delší než 200 znaků'],
    },
    slug: {
      type: String,
      required: [true, 'URL slug je povinný'],
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug může obsahovat pouze malá písmena, čísla a pomlčky'],
    },
    description: {
      type: String,
      required: [true, 'Popis galerie je povinný'],
      trim: true,
      maxlength: [1000, 'Popis galerie nemůže být delší než 1000 znaků'],
    },
    event: {
      type: String,
      required: [true, 'Název akce je povinný'],
      trim: true,
      maxlength: [200, 'Název akce nemůže být delší než 200 znaků'],
    },
    date: {
      type: Date,
      required: [true, 'Datum akce je povinné'],
    },
    photos: [PhotoSchema],
    coverPhoto: {
      type: String,
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i, 'Neplatná URL náhledu'],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: [true, 'Údaj o tvůrci je povinný'],
      trim: true,
      maxlength: [100, 'Jméno tvůrce nemůže být delší než 100 znaků'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
PhotoGallerySchema.index({ slug: 1 });
PhotoGallerySchema.index({ isPublic: 1 });
PhotoGallerySchema.index({ date: -1 });
PhotoGallerySchema.index({ event: 1 });
PhotoGallerySchema.index({ 'photos.tags': 1 });

// Pre-save middleware to generate slug and set cover photo
PhotoGallerySchema.pre('save', function() {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  // Set cover photo to first photo if not set
  if (!this.coverPhoto && this.photos && this.photos.length > 0) {
    this.coverPhoto = this.photos[0].url;
  }
});

// Virtual for photo count
PhotoGallerySchema.virtual('photoCount').get(function() {
  return this.photos ? this.photos.length : 0;
});

export default mongoose.models.PhotoGallery || mongoose.model<IPhotoGallery>('PhotoGallery', PhotoGallerySchema);