import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string; // hashed
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

export const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema);
