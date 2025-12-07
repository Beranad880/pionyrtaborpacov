import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: 'camp' | 'meeting' | 'trip' | 'workshop' | 'competition' | 'other';
  maxParticipants?: number;
  currentParticipants: number;
  registrationDeadline?: Date;
  organizer: string;
  status: 'planned' | 'confirmed' | 'cancelled' | 'completed';
  isPublic: boolean;
  price?: number;
  ageGroup?: {
    min: number;
    max: number;
  };
  requirements?: string[];
  equipment?: string[];
  images?: string[];
  registrationForm?: {
    fields: {
      name: string;
      type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
      required: boolean;
      options?: string[];
    }[];
  };
  participants?: {
    name: string;
    email: string;
    phone?: string;
    age?: number;
    additionalInfo?: any;
    registeredAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Název akce je povinný'],
      trim: true,
      maxlength: [200, 'Název akce nemůže být delší než 200 znaků'],
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
      required: [true, 'Popis akce je povinný'],
      trim: true,
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
        validator: function(this: any, value: Date) {
          return value >= this.startDate;
        },
        message: 'Datum konce musí být stejné nebo po datu začátku',
      },
    },
    location: {
      type: String,
      required: [true, 'Místo konání je povinné'],
      trim: true,
      maxlength: [200, 'Místo konání nemůže být delší než 200 znaků'],
    },
    type: {
      type: String,
      enum: ['camp', 'meeting', 'trip', 'workshop', 'competition', 'other'],
      required: [true, 'Typ akce je povinný'],
    },
    maxParticipants: {
      type: Number,
      min: [1, 'Maximální počet účastníků musí být alespoň 1'],
      max: [500, 'Maximální počet účastníků nemůže být více než 500'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },
    registrationDeadline: Date,
    organizer: {
      type: String,
      required: [true, 'Organizátor je povinný'],
      trim: true,
      maxlength: [100, 'Jméno organizátora nemůže být delší než 100 znaků'],
    },
    status: {
      type: String,
      enum: ['planned', 'confirmed', 'cancelled', 'completed'],
      default: 'planned',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      min: [0, 'Cena nemůže být záporná'],
    },
    ageGroup: {
      min: {
        type: Number,
        min: [3, 'Minimální věk je 3 roky'],
      },
      max: {
        type: Number,
        max: [99, 'Maximální věk je 99 let'],
      },
    },
    requirements: [{
      type: String,
      trim: true,
      maxlength: [200, 'Požadavek nemůže být delší než 200 znaků'],
    }],
    equipment: [{
      type: String,
      trim: true,
      maxlength: [200, 'Vybavení nemůže být delší než 200 znaků'],
    }],
    images: [{
      type: String,
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i, 'Neplatná URL obrázku'],
    }],
    registrationForm: {
      fields: [{
        name: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          enum: ['text', 'email', 'phone', 'textarea', 'select'],
          required: true,
        },
        required: {
          type: Boolean,
          default: false,
        },
        options: [String],
      }],
    },
    participants: [{
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Jméno účastníka nemůže být delší než 100 znaků'],
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email není ve správném formátu'],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^(\+420)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/, 'Telefon není ve správném formátu'],
      },
      age: {
        type: Number,
        min: [3, 'Věk musí být alespoň 3 roky'],
        max: [99, 'Věk nemůže být více než 99 let'],
      },
      additionalInfo: Schema.Types.Mixed,
      registeredAt: {
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
EventSchema.index({ slug: 1 });
EventSchema.index({ type: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ startDate: 1 });
EventSchema.index({ isPublic: 1 });
EventSchema.index({ 'participants.email': 1 });

// Pre-save middleware to generate slug and update participant count
EventSchema.pre('save', function() {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  if (this.participants) {
    this.currentParticipants = this.participants.length;
  }
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);