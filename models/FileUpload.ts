import mongoose, { Schema, Document } from 'mongoose';

export interface IFileUpload extends Document {
  fileName: string;
  fileUrl: string;
  fileType: string;
  size: number;
  uploadedBy: mongoose.Types.ObjectId;
  relatedId?: string;
  relatedType?: 'Venue' | 'Request' | 'Block';
  createdAt: Date;
}

const fileUploadSchema = new Schema<IFileUpload>(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    size: Number,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedId: String,
    relatedType: {
      type: String,
      enum: ['Venue', 'Request', 'Block'],
    },
  },
  { timestamps: true }
);

export const FileUpload = mongoose.models.FileUpload || mongoose.model<IFileUpload>('FileUpload', fileUploadSchema);
