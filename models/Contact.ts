import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  organizationName: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  bankAccount: string;
  ico: string;
  dic: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  leadership: {
    leader: string;
    treasurer: string;
    auditor: string;
    delegates: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    organizationName: {
      type: String,
      required: [true, 'Název organizace je povinný'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Popis organizace je povinný'],
      maxlength: [1000, 'Popis nemůže být delší než 1000 znaků'],
    },
    email: {
      type: String,
      required: [true, 'Email je povinný'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Zadejte platný email'],
    },
    phone: {
      type: String,
      required: [true, 'Telefon je povinný'],
      match: [/^(\+420)?[0-9\s]{9,}$/, 'Zadejte platné telefonní číslo'],
    },
    address: {
      type: String,
      required: [true, 'Adresa je povinná'],
      maxlength: [200, 'Adresa nemůže být delší než 200 znaků'],
    },
    bankAccount: {
      type: String,
      required: [true, 'Číslo účtu je povinné'],
    },
    ico: {
      type: String,
      required: [true, 'IČ je povinné'],
    },
    dic: {
      type: String,
      required: [true, 'DIČ je povinné'],
    },
    socialMedia: {
      facebook: {
        type: String,
        match: [/^https?:\/\/(www\.)?facebook\.com\/.*/, 'Neplatný Facebook URL'],
      },
      instagram: {
        type: String,
        match: [/^https?:\/\/(www\.)?instagram\.com\/.*/, 'Neplatný Instagram URL'],
      },
      website: {
        type: String,
        match: [/^https?:\/\/.*/, 'Neplatný URL webových stránek'],
      },
    },
    leadership: {
      leader: {
        type: String,
        required: [true, 'Vedoucí je povinný'],
        trim: true,
      },
      treasurer: {
        type: String,
        required: [true, 'Hospodář je povinný'],
        trim: true,
      },
      auditor: {
        type: String,
        required: [true, 'Revizor je povinný'],
        trim: true,
      },
      delegates: [{
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

// Ensure only one active contact record
ContactSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);