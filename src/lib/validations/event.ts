import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required").max(255, "Event name is too long"),
  description: z.string().min(1, "Description is required"),
  bannerImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().min(1, "Location is required").max(255, "Location is too long"),
  isOnline: z.boolean().default(false),
  meetingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  venue: z.string().max(255, "Venue name is too long").optional().or(z.literal("")),
  capacity: z.number().int().positive("Capacity must be a positive number").optional().or(z.null()),
  isPaid: z.boolean().default(false),
  price: z.number().nonnegative("Price must be non-negative").optional().or(z.null()),
  date: z.string().min(1, "Date is required"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

