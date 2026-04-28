import { NextRequest } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import type { Lang } from "@/lib/forum"
import type { Prisma } from "@/generated/prisma/client"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const q = (searchParams.get("q") ?? "").trim()
  const industry = searchParams.get("industry") ?? ""
  const lang = (searchParams.get("lang") ?? "") as Lang | ""

  const where: Prisma.SubmissionWhereInput = {}
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
      { position: { contains: q, mode: "insensitive" } },
    ]
  }
  if (industry) where.industries = { has: industry }
  if (lang) where.language = lang

  const rows = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  const header = [
    "id",
    "fullName",
    "phone",
    "company",
    "position",
    "industries",
    "consent",
    "language",
    "createdAt",
  ]
  const body = rows.map((r) =>
    [
      r.id,
      r.fullName,
      r.phone,
      r.company,
      r.position,
      r.industries.join("|"),
      r.consent ? "true" : "false",
      r.language,
      r.createdAt.toISOString(),
    ]
      .map(csvEscape)
      .join(","),
  )

  const csv = [header.join(","), ...body].join("\n")
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  })
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
