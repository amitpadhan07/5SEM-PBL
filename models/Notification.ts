import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'AccountVerified' | 'Welcome' | 'ProfileReminder' | 'RequestSubmitted' | 'RequestReceived' | 'RequestApproved' | 'RequestRejected' | 'RequestCancelled' | 'RequestExpired' | 'VenueBlocked' | 'AuthorityChanged' | 'EventReminder24h' | 'EventReminder2h' | 'BookingCompleted';
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: 'Request' | 'Venue' | 'User' | 'Department';
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  deletedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'AccountVerified',
        'Welcome',
        'ProfileReminder',
        'RequestSubmitted',
        'RequestReceived',
        'RequestApproved',
        'RequestRejected',
        'RequestCancelled',
        'RequestExpired',
        'VenueBlocked',
        'AuthorityChanged',
        'EventReminder24h',
        'EventReminder2h',
        'BookingCompleted',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: String,
    relatedType: {
      type: String,
      enum: ['Request', 'Venue', 'User', 'Department'],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
