import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemSettings extends Document {
  collegeInfo: {
    name: string;
    logo?: string;
    contactEmail: string;
    contactPhone: string;
    timezone: string;
  };
  auth: {
    otpExpiry: number; // minutes
    passwordPolicy: string;
    sessionTimeout: number; // minutes
  };
  booking: {
    requestExpiry: number; // hours
    workingHours: {
      startTime: string;
      endTime: string;
    };
    bookingPriorities: string[];
    maxAdvanceBookingDays: number;
    maxBookingDuration: number; // hours
  };
  email: {
    brevoApiKey?: string;
    senderEmail: string;
    senderName: string;
    branding?: {
      logoUrl?: string;
      primaryColor?: string;
    };
  };
  maintenance: {
    globalMaintenanceMode: boolean;
    scheduledMaintenance?: {
      startTime: Date;
      endTime: Date;
      message: string;
    };
  };
  calendar: {
    workingDays: string[];
    holidays: Date[];
    academicCalendar?: {
      semester1Start: Date;
      semester1End: Date;
      semester2Start: Date;
      semester2End: Date;
    };
  };
  security: {
    rateLimitingEnabled: boolean;
    allowedDomains: string[];
    loginAttemptLimit: number;
  };
  backup: {
    databaseBackupSchedule: string;
    logRetentionDays: number;
  };
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
}

const systemSettingsSchema = new Schema<ISystemSettings>(
  {
    collegeInfo: {
      name: { type: String, required: true },
      logo: String,
      contactEmail: { type: String, required: true },
      contactPhone: { type: String, required: true },
      timezone: { type: String, default: 'Asia/Kolkata' },
    },
    auth: {
      otpExpiry: { type: Number, default: 10 },
      passwordPolicy: { type: String, default: 'min 8 characters' },
      sessionTimeout: { type: Number, default: 60 },
    },
    booking: {
      requestExpiry: { type: Number, default: 48 },
      workingHours: {
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '18:00' },
      },
      bookingPriorities: [String],
      maxAdvanceBookingDays: { type: Number, default: 30 },
      maxBookingDuration: { type: Number, default: 8 },
    },
    email: {
      senderEmail: { type: String, required: true },
      senderName: { type: String, required: true },
      branding: {
        logoUrl: String,
        primaryColor: String,
      },
    },
    maintenance: {
      globalMaintenanceMode: { type: Boolean, default: false },
      scheduledMaintenance: {
        startTime: Date,
        endTime: Date,
        message: String,
      },
    },
    calendar: {
      workingDays: [{ type: String, default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }],
      holidays: [Date],
      academicCalendar: {
        semester1Start: Date,
        semester1End: Date,
        semester2Start: Date,
        semester2End: Date,
      },
    },
    security: {
      rateLimitingEnabled: { type: Boolean, default: true },
      allowedDomains: [String],
      loginAttemptLimit: { type: Number, default: 5 },
    },
    backup: {
      databaseBackupSchedule: { type: String, default: 'daily' },
      logRetentionDays: { type: Number, default: 90 },
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: false }
);

export const SystemSettings = mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', systemSettingsSchema);
