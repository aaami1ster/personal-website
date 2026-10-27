import { z } from "zod";

// Contact form schema (design spec §10.1, §10.2), shared by the client form and
// POST /api/contact so both sides apply the same rules. Each error is a message
// key, not prose: the form maps it to `Contact.errors.<key>`, and the route
// never returns field details.

export const inquiryTypes = ["job", "consulting", "collaboration", "other"] as const;
export type InquiryType = (typeof inquiryTypes)[number];

export const contactErrorKeys = [
  "nameLength",
  "emailInvalid",
  "inquiryRequired",
  "organizationLength",
  "messageLength",
  "consentRequired",
] as const;
export type ContactErrorKey = (typeof contactErrorKeys)[number];

const nameLength = { error: "nameLength" } as const;
const emailInvalid = { error: "emailInvalid" } as const;
const organizationLength = { error: "organizationLength" } as const;
const messageLength = { error: "messageLength" } as const;

export const contactSchema = z.object({
  name: z.string(nameLength).trim().min(2, nameLength).max(100, nameLength),
  // Trim first, then check the format and length on the trimmed value.
  email: z
    .string(emailInvalid)
    .trim()
    .pipe(z.email(emailInvalid).max(254, emailInvalid)),
  inquiry: z.enum(inquiryTypes, { error: "inquiryRequired" }),
  organization: z
    .string(organizationLength)
    .trim()
    .max(120, organizationLength)
    .optional(),
  message: z
    .string(messageLength)
    .trim()
    .min(20, messageLength)
    .max(5000, messageLength),
  consent: z.literal(true, { error: "consentRequired" }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** The request body: the visitor fields plus the honeypot and the fill-time stamp. */
export const contactRequestSchema = contactSchema.extend({
  website: z.string().max(200).optional(),
  startedAt: z.number().int(),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

/** Field order, used for the error summary and to focus the first invalid field. */
export const contactFields = [
  "name",
  "email",
  "inquiry",
  "organization",
  "message",
  "consent",
] as const satisfies ReadonlyArray<keyof ContactInput>;
export type ContactField = (typeof contactFields)[number];
