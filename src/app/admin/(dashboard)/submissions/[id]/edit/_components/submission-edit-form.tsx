"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { INDUSTRIES, type IndustryValue } from "@/lib/forum"
import { cn } from "@/lib/utils"

type Initial = {
  fullName: string
  phone: string
  company: string
  position: string
  industries: string[]
  consent: boolean
  language: string
}

export function SubmissionEditForm({
  action,
  initial,
}: {
  action: (formData: FormData) => unknown
  initial: Initial
}) {
  const [industries, setIndustries] = React.useState<string[]>(initial.industries)
  const [pending, startTransition] = React.useTransition()

  function toggleIndustry(value: IndustryValue, checked: boolean) {
    setIndustries((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    )
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.delete("industries")
    industries.forEach((v) => formData.append("industries", v))
    startTransition(async () => {
      await action(formData)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field id="fullName" label="Full name">
        <Input id="fullName" name="fullName" defaultValue={initial.fullName} required />
      </Field>
      <Field id="phone" label="Phone">
        <Input id="phone" name="phone" defaultValue={initial.phone} required />
      </Field>
      <Field id="company" label="Company">
        <Input id="company" name="company" defaultValue={initial.company} required />
      </Field>
      <Field id="position" label="Position">
        <Input id="position" name="position" defaultValue={initial.position} required />
      </Field>

      <Field id="language" label="Language">
        <select
          id="language"
          name="language"
          defaultValue={initial.language}
          className="h-9 rounded-3xl border-0 bg-input/50 px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <option value="uz">Uzbek</option>
          <option value="ru">Russian</option>
          <option value="en">English</option>
        </select>
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Industries</legend>
        <div className="grid grid-cols-1 gap-1 rounded-3xl bg-muted/40 p-2 sm:grid-cols-2">
          {INDUSTRIES.map((item) => {
            const checked = industries.includes(item.value)
            const id = `industry-${item.value}`
            return (
              <label
                key={item.value}
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                  checked
                    ? "bg-card text-foreground shadow-sm ring-1 ring-foreground/5"
                    : "text-foreground/80 hover:bg-card/60",
                )}
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={(value) =>
                    toggleIndustry(item.value, value === true)
                  }
                />
                <span className="leading-snug">{item.label.en}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <label
        htmlFor="consent"
        className="flex cursor-pointer items-start gap-3 rounded-2xl bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground"
      >
        <Checkbox
          id="consent"
          name="consent"
          defaultChecked={initial.consent}
          className="mt-0.5"
        />
        <span>Consent confirmed by participant</span>
      </label>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
