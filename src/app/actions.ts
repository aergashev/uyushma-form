"use server"

import { z } from "zod"

import { prisma } from "@/lib/db"
import { submissionSchema, type SubmissionInput } from "@/lib/schemas"

export type SubmitState =
  | { ok: true; id: string }
  | { ok: false; fieldErrors: Record<string, string[]> }
  | { ok: false; error: string }

export async function submitRegistration(
  input: SubmissionInput,
): Promise<SubmitState> {
  const parsed = submissionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    }
  }

  try {
    const created = await prisma.submission.create({
      data: parsed.data,
      select: { id: true },
    })
    return { ok: true, id: created.id }
  } catch (error) {
    console.error("submitRegistration failed", error)
    return { ok: false, error: "Could not save submission. Please try again." }
  }
}
