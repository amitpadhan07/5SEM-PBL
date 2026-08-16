import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  role: 'Student' | 'Faculty' | 'HOD' | 'Exam Cell' | 'Admin';
  designation?: string;
  studentId?: string;
  employeeId?: string;
  department?: mongoose.Types.ObjectId;
  phone?: string;
  photo?: string;
  isEmailVerified: boolean;
  googleId?: string;
  profileCompletionPercentage: number;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ['Student', 'Faculty', 'HOD', 'Exam Cell', 'Admin'],
      default: 'Student',
      required: true,
    },
    designation: String,
    studentId: {
      type: String,
      sparse: true,
    },
    employeeId: {
      type: String,
      sparse: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    phone: String,
    photo: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ role: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
