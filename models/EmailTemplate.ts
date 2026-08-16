import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailTemplate extends Document {
  name: string;
  type: 'VerificationOTP' | 'Welcome' | 'PasswordReset' | 'RequestSubmitted' | 'RequestApproved' | 'RequestRejected' | 'RequestExpired' | 'EventReminder24h' | 'EventReminder2h' | 'BookingCompleted' | 'VenueBlocked' | 'AuthorityChanged' | 'ProfileCompletion';
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const emailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: [
        'VerificationOTP',
        'Welcome',
        'PasswordReset',
        'RequestSubmitted',
        'RequestApproved',
        'RequestRejected',
        'RequestExpired',
        'EventReminder24h',
        'EventReminder2h',
        'BookingCompleted',
        'VenueBlocked',
        'AuthorityChanged',
        'ProfileCompletion',
      ],
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    textContent: String,
    variables: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', emailTemplateSchema);
