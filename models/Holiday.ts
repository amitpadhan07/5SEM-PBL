import mongoose, { Schema, Document } from 'mongoose';

export interface IHoliday extends Document {
  name: string;
  date: Date;
  recurring: boolean;
  month?: number;
  day?: number;
  notes?: string;
  createdAt: Date;
}

const holidaySchema = new Schema<IHoliday>(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    month: Number,
    day: Number,
    notes: String,
  },
  { timestamps: true }
);

holidaySchema.index({ date: 1 });

export const Holiday = mongoose.models.Holiday || mongoose.model<IHoliday>('Holiday', holidaySchema);
