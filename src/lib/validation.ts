import { z } from "zod";

export const AttendeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  dob: z.string().regex(/\d{4}-\d{2}-\d{2}/, "DOB must be YYYY-MM-DD"),
  gender: z.enum(["male", "female"]).optional().or(z.literal("")),
  idNumber: z.string().min(3),
});

export const OrderCreateSchema = z.object({
  eventSource: z.enum(["ticketmaster", "custom"]),
  eventId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
  totalAmount: z.number().int().min(0), // cents
  currency: z.string().length(3),
  attendee: AttendeeSchema,
});

export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;
export type AttendeeInput = z.infer<typeof AttendeeSchema>;
