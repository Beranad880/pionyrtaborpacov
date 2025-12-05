import mongoose, { Document, Schema } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  type: 'camp' | 'meeting_room' | 'sports_facility' | 'other';
  description: string;
  details: string;
  location: {
    address?: string;
    gps?: string;
    nearestTown?: string;
    description?: string;
  };
  equipment: string[];
  activities: string[];
  capacity: number;
  images: string[];
  contact: {
    email?: string;
    phone?: string;
    person?: string;
  };
  rental: {
    isAvailable: boolean;
    pricePerDay?: number;
    pricePerWeek?: number;
    rules: string[];
    bookingSteps: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema = new Schema<IFacility>(
  {
    name: {
      type: String,
      required: [true, 'Název zařízení je povinný'],
      trim: true,
      maxlength: [100, 'Název nemůže být delší než 100 znaků'],
    },
    type: {
      type: String,
      enum: ['camp', 'meeting_room', 'sports_facility', 'other'],
      required: [true, 'Typ zařízení je povinný'],
    },
    description: {
      type: String,
      required: [true, 'Popis je povinný'],
      maxlength: [1000, 'Popis nemůže být delší než 1000 znaků'],
    },
    details: {
      type: String,
      maxlength: [500, 'Detaily nemohou být delší než 500 znaků'],
    },
    location: {
      address: {
        type: String,
        maxlength: [200, 'Adresa nemůže být delší než 200 znaků'],
      },
      gps: {
        type: String,
        match: [/^[0-9.,-\s]+$/, 'Neplatný formát GPS souřadnic'],
      },
      nearestTown: {
        type: String,
        maxlength: [100, 'Název města nemůže být delší než 100 znaků'],
      },
      description: {
        type: String,
        maxlength: [500, 'Popis lokace nemůže být delší než 500 znaků'],
      },
    },
    equipment: [{
      type: String,
      trim: true,
      maxlength: [100, 'Položka vybavení nemůže být delší než 100 znaků'],
    }],
    activities: [{
      type: String,
      trim: true,
      maxlength: [100, 'Aktivita nemůže být delší než 100 znaků'],
    }],
    capacity: {
      type: Number,
      required: [true, 'Kapacita je povinná'],
      min: [1, 'Kapacita musí být alespoň 1'],
    },
    images: [{
      type: String,
      trim: true,
    }],
    contact: {
      email: {
        type: String,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Zadejte platný email'],
      },
      phone: {
        type: String,
        match: [/^(\+420)?[0-9\s]{9,}$/, 'Zadejte platné telefonní číslo'],
      },
      person: {
        type: String,
        trim: true,
      },
    },
    rental: {
      isAvailable: {
        type: Boolean,
        default: false,
      },
      pricePerDay: {
        type: Number,
        min: [0, 'Cena nemůže být záporná'],
      },
      pricePerWeek: {
        type: Number,
        min: [0, 'Cena nemůže být záporná'],
      },
      rules: [{
        type: String,
        trim: true,
      }],
      bookingSteps: [{
        type: String,
        trim: true,
      }],
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
FacilitySchema.index({ name: 1 });
FacilitySchema.index({ type: 1 });
FacilitySchema.index({ isActive: 1 });

export default mongoose.models.Facility || mongoose.model<IFacility>('Facility', FacilitySchema);