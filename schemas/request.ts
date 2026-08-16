import { z } from 'zod';

export const createVenueRequestSchema = z.object({
  eventName: z.string().min(2, 'Event name is required'),
  purpose: z.string().min(5, 'Purpose must be at least 5 characters'),
  organizer: z.string().min(2, 'Organizer name is required'),
  department: z.string().min(1, 'Department is required'),
  expectedParticipants: z.number().int().min(1, 'Expected participants must be at least 1'),
  chiefGuest: z.string().optional(),
  venue: z.string().min(1, 'Venue is required'),
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be in HH:mm format'),
  requirements: z.array(z.string()).optional(),
  remarks: z.string().optional(),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string(),
  })).optional(),
});

export const approveRequestSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  note: z.string().optional(),
});

export const rejectRequestSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  reason: z.string().min(5, 'Rejection reason must be at least 5 characters'),
});

export const cancelRequestSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  reason: z.string().optional(),
});

export type CreateVenueRequestInput = z.infer<typeof createVenueRequestSchema>;
export type ApproveRequestInput = z.infer<typeof approveRequestSchema>;
export type RejectRequestInput = z.infer<typeof rejectRequestSchema>;
export type CancelRequestInput = z.infer<typeof cancelRequestSchema>;
