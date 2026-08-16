import { z } from 'zod';

export const createVenueSchema = z.object({
  name: z.string().min(2, 'Venue name is required'),
  code: z.string().min(2, 'Venue code is required'),
  building: z.string().min(1, 'Building is required'),
  floor: z.number().int().min(0),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  type: z.enum(['Classroom', 'Lecture Theatre', 'Seminar Hall', 'Auditorium', 'Hall', 'Open Auditorium', 'Conference Room', 'Lab', 'Others']),
  description: z.string().optional(),
  facilities: z.object({
    ac: z.boolean().optional(),
    projector: z.boolean().optional(),
    smartBoard: z.boolean().optional(),
    whiteboard: z.boolean().optional(),
    wifi: z.boolean().optional(),
    soundSystem: z.boolean().optional(),
    podium: z.boolean().optional(),
    microphone: z.boolean().optional(),
    stage: z.boolean().optional(),
    generatorBackup: z.boolean().optional(),
    wheelchairAccessibility: z.boolean().optional(),
    parking: z.boolean().optional(),
  }).optional(),
});

export const createVenueBlockSchema = z.object({
  venueId: z.string().min(1, 'Venue is required'),
  reason: z.enum(['Maintenance', 'Examination', 'VIPEvent', 'Renovation', 'Cleaning', 'GovernmentVisit', 'Emergency', 'Holiday', 'Other']),
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime(),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
  isFullDay: z.boolean().default(true),
  isRecurring: z.boolean().optional(),
  recurringPattern: z.string().optional(),
  notes: z.string().optional(),
});

export const assignAuthoritySchema = z.object({
  userId: z.string().min(1, 'User is required'),
  venues: z.array(z.string()).min(1, 'At least one venue is required'),
});

export type CreateVenueInput = z.infer<typeof createVenueSchema>;
export type CreateVenueBlockInput = z.infer<typeof createVenueBlockSchema>;
export type AssignAuthorityInput = z.infer<typeof assignAuthoritySchema>;
