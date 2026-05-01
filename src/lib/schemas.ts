import { z } from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"

import { INDUSTRY_VALUES, LANGS } from "./forum"

const industryEnum = z.enum(INDUSTRY_VALUES)
const langEnum = z.enum(LANGS)

export const submissionSchema = z.object({
  fullName: z.string().trim().min(1, "Required").max(120),
  phone: z
    .string()
    .trim()
    .min(3, "Required")
    .max(40)
    .refine((val) => isValidPhoneNumber(val), { message: "Invalid phone number" }),
  company: z.string().trim().min(1, "Required").max(200),
  position: z.string().trim().min(1, "Required").max(120),
  industries: z.array(industryEnum).min(1, "Select at least one industry"),
  consent: z.literal(true, { message: "Consent is required" }),
  language: langEnum.default("uz"),
})

export type SubmissionInput = z.infer<typeof submissionSchema>

export const submissionUpdateSchema = submissionSchema.extend({
  consent: z.boolean(),
})

export type SubmissionUpdateInput = z.infer<typeof submissionUpdateSchema>

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export type LoginInput = z.infer<typeof loginSchema>
