import Link from "next/link"
import { notFound } from "next/navigation"
import { RiArrowLeftLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"

import { updateSubmission } from "../../../../_actions"
import { SubmissionEditForm } from "./_components/submission-edit-form"

export default async function SubmissionEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const submission = await prisma.submission.findUnique({ where: { id } })
  if (!submission) notFound()

  const update = updateSubmission.bind(null, submission.id)

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="self-start">
        <Link href={`/admin/submissions/${submission.id}`}>
          <RiArrowLeftLine /> Back to submission
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit submission</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionEditForm
            action={update}
            initial={{
              fullName: submission.fullName,
              phone: submission.phone,
              company: submission.company,
              position: submission.position,
              industries: submission.industries,
              consent: submission.consent,
              language: submission.language,
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
