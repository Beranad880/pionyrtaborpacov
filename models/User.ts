import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'leader' | 'admin';
  dateOfBirth?: Date;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  membershipStatus: 'active' | 'inactive' | 'pending';
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Jméno je povinné'],
      trim: true,
      maxlength: [100, 'Jméno nemůže být delší než 100 znaků'],
    },
    email: {
      type: String,
      required: [true, 'Email je povinný'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Zadejte platný email'],
    },
    phone: {
      type: String,
      match: [/^(\+420)?[0-9]{9}$/, 'Zadejte platné telefonní číslo'],
    },
    role: {
      type: String,
      enum: ['member', 'leader', 'admin'],
      default: 'member',
    },
    dateOfBirth: Date,
    address: {
      type: String,
      maxlength: [200, 'Adresa nemůže být delší než 200 znaků'],
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ membershipStatus: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);