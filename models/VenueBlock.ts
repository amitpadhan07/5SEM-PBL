import mongoose, { Schema, Document } from 'mongoose';

export interface IVenueBlock extends Document {
  venue: mongoose.Types.ObjectId;
  reason: 'Maintenance' | 'Examination' | 'VIPEvent' | 'Renovation' | 'Cleaning' | 'GovernmentVisit' | 'Emergency' | 'Holiday' | 'Other';
  dateStart: Date;
  dateEnd: Date;
  timeStart?: string; // HH:mm format
  timeEnd?: string; // HH:mm format
  isFullDay: boolean;
  isRecurring: boolean;
  recurringPattern?: string; // e.g., 'WEEKLY', 'MONTHLY'
  notes?: string;
  documentUrl?: string;
  blockedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const venueBlockSchema = new Schema<IVenueBlock>(
  {
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    reason: {
      type: String,
      enum: ['Maintenance', 'Examination', 'VIPEvent', 'Renovation', 'Cleaning', 'GovernmentVisit', 'Emergency', 'Holiday', 'Other'],
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    timeStart: String,
    timeEnd: String,
    isFullDay: {
      type: Boolean,
      default: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: String,
    notes: String,
    documentUrl: String,
    blockedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

venueBlockSchema.index({ venue: 1, dateStart: 1, dateEnd: 1 });

export const VenueBlock = mongoose.models.VenueBlock || mongoose.model<IVenueBlock>('VenueBlock', venueBlockSchema);
