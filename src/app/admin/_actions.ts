"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth, signIn, signOut } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { loginSchema, submissionUpdateSchema } from "@/lib/schemas"

export type LoginState =
  | { ok: true }
  | { ok: false; fieldErrors: Record<string, string[]> }
  | { ok: false; error: string }

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
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
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
  } catch {
    return { ok: false, error: "Invalid email or password" }
  }

  redirect("/admin")
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" })
}

async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect("/admin/login")
  }
}

export async function deleteSubmission(id: string) {
  await requireAuth()
  await prisma.submission.delete({ where: { id } })
  revalidatePath("/admin")
  revalidatePath("/admin/submissions")
}

export async function updateSubmission(id: string, formData: FormData) {
  await requireAuth()

  const industries = formData.getAll("industries").map(String)
  const parsed = submissionUpdateSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    position: formData.get("position"),
    industries,
    consent: formData.get("consent") === "on",
    language: formData.get("language") ?? "uz",
  })

  if (!parsed.success) {
    return {
      ok: false as const,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    }
  }

  await prisma.submission.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/submissions")
  revalidatePath(`/admin/submissions/${id}`)
  redirect(`/admin/submissions/${id}`)
}
