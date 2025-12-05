import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  type: 'meeting' | 'camp' | 'activity' | 'workshop' | 'other';
  maxParticipants?: number;
  currentParticipants: number;
  price?: number;
  ageGroup?: {
    min: number;
    max: number;
  };
  organizer: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  images?: string[];
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Název akce je povinný'],
      trim: true,
      maxlength: [100, 'Název akce nemůže být delší než 100 znaků'],
    },
    description: {
      type: String,
      required: [true, 'Popis akce je povinný'],
      maxlength: [2000, 'Popis akce nemůže být delší než 2000 znaků'],
    },
    startDate: {
      type: Date,
      required: [true, 'Datum začátku je povinné'],
    },
    endDate: {
      type: Date,
      required: [true, 'Datum konce je povinné'],
      validate: {
        validator: function(this: IEvent, endDate: Date) {
          return endDate >= this.startDate;
        },
        message: 'Datum konce musí být po datu začátku',
      },
    },
    location: {
      type: String,
      maxlength: [200, 'Místo konání nemůže být delší než 200 znaků'],
    },
    type: {
      type: String,
      enum: ['meeting', 'camp', 'activity', 'workshop', 'other'],
      required: [true, 'Typ akce je povinný'],
    },
    maxParticipants: {
      type: Number,
      min: [1, 'Maximální počet účastníků musí být alespoň 1'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      min: [0, 'Cena nemůže být záporná'],
    },
    ageGroup: {
      min: {
        type: Number,
        min: [6, 'Minimální věk je 6 let'],
      },
      max: {
        type: Number,
        max: [99, 'Maximální věk je 99 let'],
      },
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizátor je povinný'],
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'cancelled'],
      default: 'planned',
    },
    images: [String],
    requirements: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
EventSchema.index({ startDate: 1 });
EventSchema.index({ type: 1 });
EventSchema.index({ status: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);