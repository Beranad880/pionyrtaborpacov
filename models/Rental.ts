import mongoose, { Document, Schema } from 'mongoose';

export interface IRental extends Document {
  requestId?: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  purpose: string;
  facilities: string[];
  message?: string;
  status: 'confirmed' | 'paid' | 'completed' | 'cancelled';
  price?: number;
  invoiceId?: string;
  adminNotes?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RentalSchema = new Schema<IRental>(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RentalRequest',
    },
    name: {
      type: String,
      required: [true, 'Jméno je povinné'],
      trim: true,
      maxlength: [100, 'Jméno nemůže být delší než 100 znaků'],
    },
    email: {
      type: String,
      required: [true, 'Email je povinný'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email není ve správném formátu'],
    },
    phone: {
      type: String,
      required: [true, 'Telefon je povinný'],
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [200, 'Název organizace nemůže být delší než 200 znaků'],
    },
    startDate: {
      type: Date,
      required: [true, 'Datum příjezdu je povinné'],
    },
    endDate: {
      type: Date,
      required: [true, 'Datum odjezdu je povinné'],
      validate: {
        validator: function(this: any, value: Date) {
          return value > this.startDate;
        },
        message: 'Datum odjezdu musí být po datu příjezdu',
      },
    },
    guestCount: {
      type: Number,
      required: [true, 'Počet hostů je povinný'],
      min: [1, 'Počet hostů musí být alespoň 1'],
      max: [50, 'Počet hostů nemůže být více než 50'],
    },
    purpose: {
      type: String,
      required: [true, 'Účel pobytu je povinný'],
      trim: true,
      maxlength: [500, 'Účel pobytu nemůže být delší než 500 znaků'],
    },
    facilities: [{
      type: String,
      enum: [
        'kitchen',
        'wifi',
        'fireplace',
        'parking',
        'heating',
        'electricity',
        'water',
        'outdoor_grill',
        'sports_equipment'
      ],
    }],
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Zpráva nemůže být delší než 1000 znaků'],
    },
    status: {
      type: String,
      enum: ['confirmed', 'paid', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    price: {
      type: Number,
      min: [0, 'Cena nemůže být záporná'],
    },
    invoiceId: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Poznámky nemohou být delší než 1000 znaků'],
    },
    createdBy: {
        type: String,
        trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
RentalSchema.index({ status: 1 });
RentalSchema.index({ startDate: 1 });
RentalSchema.index({ email: 1 });
RentalSchema.index({ createdAt: -1 });

export default mongoose.models.Rental || mongoose.model<IRental>('Rental', RentalSchema);
