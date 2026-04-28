import Link from "next/link"
import { notFound } from "next/navigation"
import { RiArrowLeftLine, RiPencilLine } from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { prisma } from "@/lib/db"
import { industryLabel } from "@/lib/forum"

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const submission = await prisma.submission.findUnique({ where: { id } })
  if (!submission) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/submissions">
            <RiArrowLeftLine /> Back to list
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={`/admin/submissions/${submission.id}/edit`}>
            <RiPencilLine /> Edit
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{submission.fullName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Submitted {submission.createdAt.toISOString().slice(0, 16).replace("T", " ")}
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <Detail label="Phone" value={submission.phone} />
          <Detail label="Company" value={submission.company} />
          <Detail label="Position" value={submission.position} />
          <Detail label="Language" value={submission.language.toUpperCase()} />
          <div className="sm:col-span-2">
            <DetailLabel>Industries</DetailLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {submission.industries.map((v) => (
                <Badge key={v} variant="secondary" className="font-normal">
                  {industryLabel(v, "en")}
                </Badge>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Separator className="my-2" />
            <DetailLabel>Consent</DetailLabel>
            <div className="mt-1 text-sm">
              {submission.consent ? "Confirmed" : "Not confirmed"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
      {children}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <DetailLabel>{label}</DetailLabel>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  )
}
