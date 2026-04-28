import Link from "next/link"
import { RiDownload2Line, RiSearchLine } from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/db"
import { INDUSTRIES, industryLabel, type Lang } from "@/lib/forum"
import type { Prisma } from "@/generated/prisma/client"

import { SubmissionRowActions } from "./_components/row-actions"

const PAGE_SIZE = 20

type SearchParams = Promise<{
  q?: string
  industry?: string
  lang?: string
  page?: string
}>

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const q = (sp.q ?? "").trim()
  const industry = sp.industry ?? ""
  const lang = (sp.lang ?? "") as Lang | ""
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1)

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

  const [rows, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.submission.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const exportHref =
    "/admin/submissions/export" +
    buildQuery({ q, industry, lang })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Submissions
          </h2>
          <p className="text-sm text-muted-foreground">
            {total} record{total === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={exportHref}>
            <RiDownload2Line /> Export CSV
          </a>
        </Button>
      </div>

      <form
        method="get"
        className="grid gap-3 rounded-3xl border bg-card p-4 shadow-sm sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <div className="relative">
          <RiSearchLine className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, company, position…"
            className="pl-9"
          />
        </div>
        <select
          name="industry"
          defaultValue={industry}
          className="h-9 rounded-3xl border-0 bg-input/50 px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <option value="">All industries</option>
          {INDUSTRIES.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label.en}
            </option>
          ))}
        </select>
        <select
          name="lang"
          defaultValue={lang}
          className="h-9 rounded-3xl border-0 bg-input/50 px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <option value="">All languages</option>
          <option value="uz">UZ</option>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
        <Button type="submit" size="sm">
          Apply
        </Button>
      </form>

      <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead className="hidden lg:table-cell">Industries</TableHead>
              <TableHead className="hidden sm:table-cell">Lang</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No submissions match the current filters.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/submissions/${r.id}`} className="hover:underline">
                    {r.fullName}
                  </Link>
                  <div className="text-xs text-muted-foreground">{r.phone}</div>
                </TableCell>
                <TableCell>{r.company}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {r.position}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {r.industries.slice(0, 3).map((v) => (
                      <Badge key={v} variant="secondary" className="font-normal">
                        {industryLabel(v, "en")}
                      </Badge>
                    ))}
                    {r.industries.length > 3 && (
                      <Badge variant="outline" className="font-normal">
                        +{r.industries.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="font-medium uppercase">
                    {r.language}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.createdAt.toISOString().slice(0, 10)}
                </TableCell>
                <TableCell>
                  <SubmissionRowActions id={r.id} label={r.fullName} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={page <= 1}
              aria-disabled={page <= 1}
            >
              <Link href={"/admin/submissions" + buildQuery({ q, industry, lang, page: page - 1 })}>
                Previous
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              aria-disabled={page >= totalPages}
            >
              <Link href={"/admin/submissions" + buildQuery({ q, industry, lang, page: page + 1 })}>
                Next
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function buildQuery(input: {
  q?: string
  industry?: string
  lang?: string
  page?: number
}) {
  const params = new URLSearchParams()
  if (input.q) params.set("q", input.q)
  if (input.industry) params.set("industry", input.industry)
  if (input.lang) params.set("lang", input.lang)
  if (input.page && input.page > 1) params.set("page", String(input.page))
  const s = params.toString()
  return s ? `?${s}` : ""
}
