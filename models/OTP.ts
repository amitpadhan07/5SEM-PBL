import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string; // hashed
  purpose: 'email_verification' | 'password_reset';
  attempts: number;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['email_verification', 'password_reset'],
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedAt: Date,
  },
  { timestamps: true }
);

otpSchema.index({ email: 1, purpose: 1 });

export const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', otpSchema);
