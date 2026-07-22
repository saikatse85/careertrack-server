import { z } from "zod";

export const createApplicationSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(100, "Company name cannot exceed 100 characters."),

  jobTitle: z
    .string()
    .trim()
    .min(2, "Job title must be at least 2 characters.")
    .max(100, "Job title cannot exceed 100 characters."),

  jobUrl: z
    .string()
    .trim()
    .url("Invalid job URL.")
    .optional()
    .or(z.literal("")),

  source: z.enum([
    "LINKEDIN",
    "BDJOBS",
    "INDEED",
    "WELLFOUND",
    "FACEBOOK",
    "REFERRAL",
    "OTHER",
  ]),

  status: z
    .enum([
      "SAVED",
      "APPLIED",
      "ASSESSMENT",
      "INTERVIEW",
      "REJECTED",
      "OFFER",
    ])
    .optional(),

  applicationDate: z.string().min(1, "Application date is required."),

  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters.")
    .optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();