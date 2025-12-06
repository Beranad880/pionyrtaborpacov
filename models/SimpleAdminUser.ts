import mongoose, { Document, Schema } from 'mongoose';

export interface ISimpleAdminUser extends Document {
  username: string;
  password: string;
  email?: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SimpleAdminUserSchema = new Schema<ISimpleAdminUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator'],
      default: 'admin'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    },
    createdBy: {
      type: String,
      default: 'system'
    }
  },
  {
    timestamps: true
  }
);

// Index for better performance
SimpleAdminUserSchema.index({ username: 1 });

export default mongoose.models.SimpleAdminUser || mongoose.model<ISimpleAdminUser>('SimpleAdminUser', SimpleAdminUserSchema);