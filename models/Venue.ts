import mongoose, { Schema, Document } from 'mongoose';

export interface IVenue extends Document {
  name: string;
  code: string;
  building: mongoose.Types.ObjectId;
  floor: number;
  capacity: number;
  type: 'Classroom' | 'Lecture Theatre' | 'Seminar Hall' | 'Auditorium' | 'Hall' | 'Open Auditorium' | 'Conference Room' | 'Lab' | 'Others';
  description?: string;
  images: {
    url: string;
    isCover?: boolean;
  }[];
  facilities: {
    ac: boolean;
    projector: boolean;
    smartBoard: boolean;
    whiteboard: boolean;
    wifi: boolean;
    soundSystem: boolean;
    podium: boolean;
    microphone: boolean;
    stage: boolean;
    generatorBackup: boolean;
    wheelchairAccessibility: boolean;
    parking: boolean;
  };
  location?: {
    googleMapsLink?: string;
    campusMapPosition?: string;
  };
  workingHours?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  bookingRules?: string;
  assignedAuthorities: mongoose.Types.ObjectId[];
  status: 'Available' | 'Unavailable' | 'Maintenance';
  statistics: {
    totalBookings: number;
    lastBookingDate?: Date;
    averageMonthlyUsage: number;
  };
  isArchived: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const venueSchema = new Schema<IVenue>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    floor: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: ['Classroom', 'Lecture Theatre', 'Seminar Hall', 'Auditorium', 'Hall', 'Open Auditorium', 'Conference Room', 'Lab', 'Others'],
      required: true,
    },
    description: String,
    images: [
      {
        url: String,
        isCover: Boolean,
      },
    ],
    facilities: {
      ac: { type: Boolean, default: false },
      projector: { type: Boolean, default: false },
      smartBoard: { type: Boolean, default: false },
      whiteboard: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      soundSystem: { type: Boolean, default: false },
      podium: { type: Boolean, default: false },
      microphone: { type: Boolean, default: false },
      stage: { type: Boolean, default: false },
      generatorBackup: { type: Boolean, default: false },
      wheelchairAccessibility: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
    },
    location: {
      googleMapsLink: String,
      campusMapPosition: String,
    },
    workingHours: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    bookingRules: String,
    assignedAuthorities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Available', 'Unavailable', 'Maintenance'],
      default: 'Available',
    },
    statistics: {
      totalBookings: { type: Number, default: 0 },
      lastBookingDate: Date,
      averageMonthlyUsage: { type: Number, default: 0 },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

venueSchema.index({ building: 1 });
venueSchema.index({ status: 1 });
venueSchema.index({ assignedAuthorities: 1 });

export const Venue = mongoose.models.Venue || mongoose.model<IVenue>('Venue', venueSchema);
