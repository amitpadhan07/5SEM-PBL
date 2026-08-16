import mongoose, { Schema, Document } from 'mongoose';

export interface IVenueRequest extends Document {
  requestId: string;
  user: mongoose.Types.ObjectId;
  venue: mongoose.Types.ObjectId;
  eventName: string;
  purpose: string;
  organizer: string;
  department: mongoose.Types.ObjectId;
  expectedParticipants: number;
  chiefGuest?: string;
  dateStart: Date;
  dateEnd: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  requirements: string[];
  remarks?: string;
  attachments: {
    fileName: string;
    fileUrl: string;
  }[];
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Expired' | 'Completed';
  approvalHistory: {
    authority: mongoose.Types.ObjectId;
    status: string;
    timestamp: Date;
    note?: string;
    rejectionReason?: string;
  }[];
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  rejectedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const venueRequestSchema = new Schema<IVenueRequest>(
  {
    requestId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    expectedParticipants: {
      type: Number,
      required: true,
      min: 1,
    },
    chiefGuest: String,
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    requirements: [String],
    remarks: String,
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Expired', 'Completed'],
      default: 'Pending',
      index: true,
    },
    approvalHistory: [
      {
        authority: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        status: String,
        timestamp: Date,
        note: String,
        rejectionReason: String,
      },
    ],
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    rejectionReason: String,
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: Date,
    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

venueRequestSchema.index({ user: 1, status: 1 });
venueRequestSchema.index({ venue: 1, dateStart: 1, dateEnd: 1 });
venueRequestSchema.index({ department: 1 });

export const VenueRequest = mongoose.models.VenueRequest || mongoose.model<IVenueRequest>('VenueRequest', venueRequestSchema);
