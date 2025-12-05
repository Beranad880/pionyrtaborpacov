import mongoose, { Document, Schema } from 'mongoose';

export interface IPioneerGroup extends Document {
  name: string;
  ageRange: string;
  description: string;
  activities: string[];
  leader?: string;
  meetingDay?: string;
  meetingTime?: string;
  location?: string;
  maxMembers?: number;
  currentMembers: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PioneerGroupSchema = new Schema<IPioneerGroup>(
  {
    name: {
      type: String,
      required: [true, 'Název oddílu je povinný'],
      trim: true,
      maxlength: [100, 'Název oddílu nemůže být delší než 100 znaků'],
    },
    ageRange: {
      type: String,
      required: [true, 'Věkové rozpětí je povinné'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Popis oddílu je povinný'],
      maxlength: [500, 'Popis oddílu nemůže být delší než 500 znaků'],
    },
    activities: [{
      type: String,
      trim: true,
      maxlength: [100, 'Aktivita nemůže být delší než 100 znaků'],
    }],
    leader: {
      type: String,
      trim: true,
    },
    meetingDay: {
      type: String,
      enum: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
    },
    meetingTime: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neplatný formát času (HH:MM)'],
    },
    location: {
      type: String,
      trim: true,
    },
    maxMembers: {
      type: Number,
      min: [1, 'Maximální počet členů musí být alespoň 1'],
    },
    currentMembers: {
      type: Number,
      default: 0,
      min: 0,
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
PioneerGroupSchema.index({ name: 1 });
PioneerGroupSchema.index({ isActive: 1 });

export default mongoose.models.PioneerGroup || mongoose.model<IPioneerGroup>('PioneerGroup', PioneerGroupSchema);