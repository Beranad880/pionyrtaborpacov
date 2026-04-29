import mongoose, { Document, Schema } from 'mongoose';

export interface ICampApplication extends Document {
  isDeleted: boolean;
  deletedAt?: Date;
  // Údaje o účastníkovi
  participantName: string;
  grade: string;
  dateOfBirth: string;
  birthNumber: string;
  address: {
    street: string;
    city: string;
  };

  // Údaje o zákonném zástupci (první rodič)
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianAddress?: string; // nepovinné, pokud jiná než u dítěte

  // Údaje o druhém rodiči/kontaktní osobě
  secondContactName: string;
  secondContactPhone: string;
  secondContactEmail?: string;
  secondContactAddress?: string;

  // Systémové údaje
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Metadata
  campInfo?: {
    theme: string;
    dates: string;
    price: number;
  };
}

const CampApplicationSchema = new Schema<ICampApplication>(
  {
    // Údaje o účastníkovi
    participantName: {
      type: String,
      required: [true, 'Jméno a příjmení účastníka je povinné'],
      trim: true,
      maxlength: [150, 'Jméno nemůže být delší než 150 znaků'],
    },
    grade: {
      type: String,
      required: [true, 'Třída je povinná'],
      enum: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Datum narození je povinné'],
      trim: true,
      match: [/^\d{1,2}\.\d{1,2}\.\d{4}$/, 'Datum narození musí být ve formátu DD.MM.YYYY'],
    },
    birthNumber: {
      type: String,
      required: [true, 'Rodné číslo je povinné'],
      trim: true,
      match: [/^\d{6}\/?\d{4}$/, 'Rodné číslo musí být ve formátu RRMMDD/XXXX nebo RRMMDDXXXX'],
    },
    address: {
      street: {
        type: String,
        required: [true, 'Ulice a číslo popisné je povinné'],
        trim: true,
        maxlength: [150, 'Adresa nemůže být delší než 150 znaků'],
      },
      city: {
        type: String,
        required: [true, 'Město a PSČ je povinné'],
        trim: true,
        maxlength: [150, 'Město a PSČ nemůže být delší než 150 znaků'],
      },
    },

    // Údaje o zákonném zástupci (první rodič)
    guardianName: {
      type: String,
      required: [true, 'Jméno zákonného zástupce je povinné'],
      trim: true,
      maxlength: [150, 'Jméno nemůže být delší než 150 znaků'],
    },
    guardianPhone: {
      type: String,
      required: [true, 'Telefonní číslo je povinné'],
      trim: true,
      match: [/^[\+]?[0-9\s\-]{9,15}$/, 'Telefonní číslo není ve správném formátu'],
    },
    guardianEmail: {
      type: String,
      required: [true, 'Email je povinný'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email není ve správném formátu'],
    },
    guardianAddress: {
      type: String,
      trim: true,
      maxlength: [150, 'Adresa nemůže být delší než 150 znaků'],
    },

    // Údaje o druhém rodiči/kontaktní osobě
    secondContactName: {
      type: String,
      required: [true, 'Jméno druhého rodiče/kontaktní osoby je povinné'],
      trim: true,
      maxlength: [150, 'Jméno nemůže být delší než 150 znaků'],
    },
    secondContactPhone: {
      type: String,
      required: [true, 'Telefonní číslo druhého kontaktu je povinné'],
      trim: true,
      match: [/^[\+]?[0-9\s\-]{9,15}$/, 'Telefonní číslo není ve správném formátu'],
    },
    secondContactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email není ve správném formátu'],
    },
    secondContactAddress: {
      type: String,
      trim: true,
      maxlength: [150, 'Adresa nemůže být delší než 150 znaků'],
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Systémové údaje
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Poznámky nemohou být delší než 1000 znaků'],
    },
    processedBy: {
      type: String,
      trim: true,
    },
    processedAt: Date,

    // Metadata o táboře
    campInfo: {
      theme: {
        type: String,
        default: 'Star Wars: Vzestup Jediů',
      },
      dates: {
        type: String,
        default: '2. 7. — 11. 7. 2026',
      },
      price: {
        type: Number,
        default: 4900,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
CampApplicationSchema.index({ status: 1 });
CampApplicationSchema.index({ guardianEmail: 1 });
CampApplicationSchema.index({ createdAt: -1 });
CampApplicationSchema.index({ participantName: 1 });
CampApplicationSchema.index({ isDeleted: 1 });

// Pre-save middleware
CampApplicationSchema.pre('save', function() {
  if (this.isModified('status') && this.status !== 'pending') {
    this.processedAt = new Date();
  }
});

export default mongoose.models.CampApplication || mongoose.model<ICampApplication>('CampApplication', CampApplicationSchema);