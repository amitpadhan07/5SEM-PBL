import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId;
  role: string;
  action: 'Login' | 'Logout' | 'Signup' | 'PasswordReset' | 'ProfileUpdate' | 'VenueCreate' | 'VenueUpdate' | 'VenueDelete' | 'VenueBlock' | 'VenueUnblock' | 'AuthorityAssign' | 'RequestSubmit' | 'Approval' | 'Rejection' | 'Cancellation' | 'Expiry' | 'AdminOverride' | 'EmailSent';
  resource: string;
  resourceId?: string;
  details?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  browser?: string;
  device?: string;
  userAgent?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: [
        'Login',
        'Logout',
        'Signup',
        'PasswordReset',
        'ProfileUpdate',
        'VenueCreate',
        'VenueUpdate',
        'VenueDelete',
        'VenueBlock',
        'VenueUnblock',
        'AuthorityAssign',
        'RequestSubmit',
        'Approval',
        'Rejection',
        'Cancellation',
        'Expiry',
        'AdminOverride',
        'EmailSent',
      ],
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: String,
    details: String,
    previousValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
    ipAddress: String,
    browser: String,
    device: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
