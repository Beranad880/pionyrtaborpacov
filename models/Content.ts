import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  page: string;
  content: any;
  version: number;
  lastModified: Date;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    page: {
      type: String,
      required: [true, 'Page identifier is required'],
      unique: true,
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: [true, 'Content is required'],
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    modifiedBy: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ContentSchema.index({ lastModified: -1 });


export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);