import mongoose, { Schema, Document } from 'mongoose';

export interface IBuilding extends Document {
  name: string;
  code: string;
  campus?: string;
  floors: number;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const buildingSchema = new Schema<IBuilding>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    campus: String,
    floors: {
      type: Number,
      required: true,
      min: 1,
    },
    description: String,
    image: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


export const Building = mongoose.models.Building || mongoose.model<IBuilding>('Building', buildingSchema);
