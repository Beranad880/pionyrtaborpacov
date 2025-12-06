import { Schema, model, models } from 'mongoose';

export interface IAdminUser {
  _id?: string;
  username: string;
  password: string;
  createdAt: Date;
  lastLogin?: Date;
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Metoda pro kontrolu hesla
adminUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent password from being returned in queries by default
adminUserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const AdminUser = models.AdminUser || model<IAdminUser>('AdminUser', adminUserSchema);

export default AdminUser;