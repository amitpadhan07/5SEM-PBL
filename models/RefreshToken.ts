import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string; // hashed
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
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
  },
  { timestamps: true }
);

export const RefreshToken = mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
