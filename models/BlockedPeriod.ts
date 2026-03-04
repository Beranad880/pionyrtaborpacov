import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockedPeriod extends Document {
  startDate: Date;
  endDate: Date;
  label: string;
  createdAt: Date;
}

const BlockedPeriodSchema = new Schema<IBlockedPeriod>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    label: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

export default mongoose.models.BlockedPeriod ||
  mongoose.model<IBlockedPeriod>('BlockedPeriod', BlockedPeriodSchema);
