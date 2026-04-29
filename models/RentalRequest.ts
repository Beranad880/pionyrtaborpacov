import mongoose, { Document, Schema } from 'mongoose';

export interface IRentalRequest extends Document {
  isDeleted: boolean;
  deletedAt?: Date;
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
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RentalRequestSchema = new Schema<IRentalRequest>(
  {
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

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
      match: [/^(\+420)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/, 'Telefon není ve správném formátu'],
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [200, 'Název organizace nemůže být delší než 200 znaků'],
    },
    startDate: {
      type: Date,
      required: [true, 'Datum příjezdu je povinné'],
      validate: {
        validator: function(value: Date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to start of day
          const inputDate = new Date(value);
          inputDate.setHours(0, 0, 0, 0); // Set to start of day
          return inputDate >= today;
        },
        message: 'Datum příjezdu nemůže být v minulosti',
      },
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
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
RentalRequestSchema.index({ status: 1 });
RentalRequestSchema.index({ startDate: 1 });
RentalRequestSchema.index({ email: 1 });
RentalRequestSchema.index({ createdAt: -1 });

// Pre-save middleware
RentalRequestSchema.pre('save', function() {
  if (this.isModified('status') && this.status !== 'pending') {
    this.processedAt = new Date();
  }
});

export default mongoose.models.RentalRequest || mongoose.model<IRentalRequest>('RentalRequest', RentalRequestSchema);