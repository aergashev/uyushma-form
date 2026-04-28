import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { INDUSTRIES, industryLabel } from "@/lib/forum"

import { DailyLineChart, IndustryBarChart } from "./_components/analytics-charts"

const DAYS_BACK = 14

function startOfUTCDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export default async function AdminDashboardPage() {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = startOfUTCDay(
    new Date(now.getTime() - DAYS_BACK * 24 * 60 * 60 * 1000),
  )

  const [total, last7, recentSubmissions, langGroups] = await Promise.all([
    prisma.submission.count(),
    prisma.submission.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.submission.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { industries: true, createdAt: true, language: true },
    }),
    prisma.submission.groupBy({
      by: ["language"],
      _count: { _all: true },
    }),
  ])

  const industryCounts = new Map<string, number>(
    INDUSTRIES.map((i) => [i.value, 0]),
  )
  recentSubmissions.forEach((s) => {
    s.industries.forEach((value) => {
      industryCounts.set(value, (industryCounts.get(value) ?? 0) + 1)
    })
  })
  const industryData = Array.from(industryCounts, ([value, count]) => ({
    industry: industryLabel(value, "en").split(" ")[0],
    count,
  }))

  const dayBuckets = new Map<string, number>()
  for (let i = DAYS_BACK - 1; i >= 0; i--) {
    const d = startOfUTCDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000))
    dayBuckets.set(d.toISOString().slice(5, 10), 0)
  }
  recentSubmissions.forEach((s) => {
    const key = startOfUTCDay(s.createdAt).toISOString().slice(5, 10)
    if (dayBuckets.has(key)) {
      dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1)
    }
  })
  const dailyData = Array.from(dayBuckets, ([date, count]) => ({ date, count }))

  const topIndustryEntry = Array.from(industryCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  )[0]
  const topIndustry =
    topIndustryEntry && topIndustryEntry[1] > 0
      ? industryLabel(topIndustryEntry[0], "en")
      : "—"

  const langSummary = langGroups
    .map((g) => `${g.language.toUpperCase()} ${g._count._all}`)
    .join(" · ")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Submissions over the last {DAYS_BACK} days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total submissions" value={total.toString()} />
        <StatCard label="Last 7 days" value={last7.toString()} />
        <StatCard label="Top industry" value={topIndustry} />
        <StatCard label="Languages" value={langSummary || "—"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submissions by industry</CardTitle>
            <CardDescription>Last {DAYS_BACK} days</CardDescription>
          </CardHeader>
          <CardContent>
            <IndustryBarChart data={industryData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily submissions</CardTitle>
            <CardDescription>Last {DAYS_BACK} days</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyLineChart data={dailyData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
