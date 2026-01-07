import { Schema, model, models } from 'mongoose';

export interface IAdminUser {
  _id?: string;
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

const adminUserSchema = new Schema<IAdminUser>({
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
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
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
}, {
  timestamps: true
});

// Index for better performance (username already has unique: true)

// Metoda pro kontrolu hesla
adminUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(candidatePassword, this.password);
};

// Hash password before saving
adminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return;

  try {
    const bcrypt = require('bcrypt');
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    throw error;
  }
});

// Prevent password from being returned in queries by default
adminUserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const AdminUser = models.AdminUser || model<IAdminUser>('AdminUser', adminUserSchema, 'simpleadminusers');

export default AdminUser;