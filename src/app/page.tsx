"use client"

import * as React from "react"
import Image from "next/image"
import { RiMoonLine, RiSunLine } from "@remixicon/react"
import { toast } from "sonner"

import { submitRegistration } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { isValidPhoneNumber } from "libphonenumber-js"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { INDUSTRIES, type IndustryValue, type Lang } from "@/lib/forum"
import { submissionSchema } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import Logo from "../../public/logo.png"

const COPY = {
  uz: {
    langLabel: "Tilni tanlash",
    title: "O‘zbekiston Xalqaro Iqtisodiy Hamkorlik II Forumi",
    eventInfo: "13–15 may • Botanika bog‘i",
    formTitle: "Ishtirokchilarni ro‘yxatdan o‘tkazish",
    formDescription: "Forumda ishtirok etish uchun formani to‘ldiring",
    fullName: "To‘liq ism va familiyangiz",
    fullNamePlaceholder: "Aliyev Akmal",
    phone: "Telefon raqamingiz",
    phonePlaceholder: "+998 90 123 45 67",
    company: "Kompaniya / tashkilot nomi",
    companyPlaceholder: "“Misol” MChJ",
    position: "Lavozimingiz",
    positionPlaceholder: "Bosh direktor",
    industries: "Faoliyat yo‘nalishlari",
    industriesHint: "Bir nechtasini tanlash mumkin",
    consent:
      "Men taqdim etgan ma’lumotlarimning to‘g‘riligini tasdiqlayman va ularni qayta ishlashga rozilik bildiraman",
    submit: "Ariza yuborish",
    footer: "O‘zbekiston Milliy Iqtisodiy Hamkorlik Uyushmasi",
    requiredMark: "majburiy maydon",
    errorRequired: "Maydon to‘ldirilishi shart",    errorPhone: "Telefon raqami noto'g'ri",    errorIndustries: "Kamida bitta yo‘nalishni tanlang",
    errorConsent: "Davom etish uchun roziligingizni tasdiqlang",
    successTitle: "Arizangiz qabul qilindi",
    successDescription: "Tashkilotchilar siz bilan tez orada bog‘lanadi.",
    serverError: "Yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.",
  },
  ru: {
    langLabel: "Выбор языка",
    title: "Второй Международный форум экономического сотрудничества Узбекистана",
    eventInfo: "13–15 мая • Ботанический сад",
    formTitle: "Регистрация участников",
    formDescription: "Заполните форму для участия в форуме",
    fullName: "Полное имя",
    fullNamePlaceholder: "Иванов Иван",
    phone: "Номер телефона",
    phonePlaceholder: "+998 90 123 45 67",
    company: "Компания / организация",
    companyPlaceholder: "ООО «Пример»",
    position: "Должность",
    positionPlaceholder: "Генеральный директор",
    industries: "Отрасли",
    industriesHint: "Можно выбрать несколько",
    consent:
      "Подтверждаю достоверность предоставленных данных и даю согласие на их обработку",
    submit: "Отправить заявку",
    footer: "Ассоциация национального экономического сотрудничества Узбекистана",
    requiredMark: "обязательное поле",
    errorRequired: "Обязательное поле",
    errorPhone: "Неверный номер телефона",
    errorIndustries: "Выберите хотя бы одну отрасль",
    errorConsent: "Подтвердите согласие, чтобы продолжить",
    successTitle: "Заявка отправлена",
    successDescription: "Организаторы свяжутся с вами в ближайшее время.",
    serverError: "Не удалось отправить заявку. Попробуйте ещё раз.",
  },
  en: {
    langLabel: "Select language",
    title: "The Second International Economic Cooperation Forum of Uzbekistan",
    eventInfo: "May 13–15 • Botanical Garden",
    formTitle: "Participant Registration",
    formDescription: "Fill out the form to participate in the forum",
    fullName: "Full name",
    fullNamePlaceholder: "Akmal Aliyev",
    phone: "Phone number",
    phonePlaceholder: "+998 90 123 45 67",
    company: "Company / Organization",
    companyPlaceholder: "Example LLC",
    position: "Position",
    positionPlaceholder: "Chief Executive Officer",
    industries: "Industries",
    industriesHint: "You can select multiple",
    consent:
      "I confirm that the information provided is accurate and I consent to data processing",
    submit: "Submit Application",
    footer: "Association of National Economic Cooperation of Uzbekistan",
    requiredMark: "required field",
    errorRequired: "This field is required",
    errorPhone: "Invalid phone number",
    errorIndustries: "Please select at least one industry",
    errorConsent: "Please confirm your consent to continue",
    successTitle: "Application submitted",
    successDescription: "The organizers will be in touch shortly.",
    serverError: "Something went wrong. Please try again.",
  },
} as const

type Theme = "light" | "dark"

export default function RegistrationPage() {
  const [lang, setLang] = React.useState<Lang>("uz")
  const [theme, setTheme] = React.useState<Theme>("light")
  const t = COPY[lang]

  React.useEffect(() => {
    const stored = window.localStorage.getItem("theme") as Theme | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setTheme(stored ?? (prefersDark ? "dark" : "light"))
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem("theme", theme)
  }, [theme])

  const [fullName, setFullName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [position, setPosition] = React.useState("")
  const [industries, setIndustries] = React.useState<IndustryValue[]>([])
  const [consent, setConsent] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [pending, startTransition] = React.useTransition()

  type FieldError = string | null
  const errors = React.useMemo(() => {
    if (!submitted) {
      return {
        fullName: null as FieldError,
        phone: null as FieldError,
        company: null as FieldError,
        position: null as FieldError,
        industries: null as FieldError,
        consent: null as FieldError,
      }
    }
    return {
      fullName: fullName.trim() ? null : t.errorRequired,
      phone: !phone.trim()
        ? t.errorRequired
        : !isValidPhoneNumber(phone)
        ? t.errorPhone
        : null,
      company: company.trim() ? null : t.errorRequired,
      position: position.trim() ? null : t.errorRequired,
      industries: industries.length > 0 ? null : t.errorIndustries,
      consent: consent ? null : t.errorConsent,
    }
  }, [submitted, fullName, phone, company, position, industries, consent, t])

  function toggleIndustry(value: IndustryValue, checked: boolean) {
    setIndustries((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    )
  }

  function resetForm() {
    setFullName("")
    setPhone("")
    setCompany("")
    setPosition("")
    setIndustries([])
    setConsent(false)
    setSubmitted(false)
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    const parsed = submissionSchema.safeParse({
      fullName,
      phone,
      company,
      position,
      industries,
      consent,
      language: lang,
    })
    if (!parsed.success) return

    startTransition(async () => {
      const result = await submitRegistration(parsed.data)
      if (result.ok) {
        toast.success(t.successTitle, { description: t.successDescription })
        resetForm()
      } else {
        toast.error(t.serverError)
      }
    })
  }

  return (
    <div className="flex flex-1 items-start justify-center bg-linear-to-b from-zinc-50 to-zinc-100 px-4 py-8 sm:items-center sm:px-6 sm:py-16 dark:from-zinc-950 dark:to-black">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex items-center justify-between gap-4">
          <nav role="group" aria-label={t.langLabel} className="flex items-center text-sm font-medium tracking-wide">
            <LangLink active={lang === "uz"} onClick={() => setLang("uz")}>
              UZ
            </LangLink>
            <LangSeparator />
            <LangLink active={lang === "ru"} onClick={() => setLang("ru")}>
              RU
            </LangLink>
            <LangSeparator />
            <LangLink active={lang === "en"} onClick={() => setLang("en")}>
              EN
            </LangLink>
          </nav>

          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
          <Image
            src={Logo}
            alt="Uyushma"
            priority
            className="h-auto w-32 rounded-[2rem] sm:w-56"
          />
          <h1 className="mt-8 font-heading text-2xl leading-[1.15] font-semibold tracking-tight text-balance text-foreground sm:mt-10 sm:text-3xl">
            {t.title}
          </h1>
          <div className="mt-5 inline-flex items-center rounded-full bg-card px-4 py-1.5 text-xs font-medium text-foreground shadow-sm ring-1 ring-foreground/5 sm:text-sm dark:ring-foreground/10">
            {t.eventInfo}
          </div>
        </div>

        <Card className="shadow-xl ring-foreground/6 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl tracking-tight sm:text-2xl">
              {t.formTitle}
            </CardTitle>
            <CardDescription className="mx-auto max-w-sm leading-relaxed">
              {t.formDescription}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <Field
                id="fullName"
                label={t.fullName}
                required
                requiredLabel={t.requiredMark}
                error={errors.fullName}
              >
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder={t.fullNamePlaceholder}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
              </Field>

              <Field
                id="phone"
                label={t.phone}
                required
                requiredLabel={t.requiredMark}
                error={errors.phone}
              >
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </Field>

              <Field
                id="company"
                label={t.company}
                required
                requiredLabel={t.requiredMark}
                error={errors.company}
              >
                <Input
                  id="company"
                  type="text"
                  autoComplete="organization"
                  placeholder={t.companyPlaceholder}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? "company-error" : undefined}
                />
              </Field>

              <Field
                id="position"
                label={t.position}
                required
                requiredLabel={t.requiredMark}
                error={errors.position}
              >
                <Input
                  id="position"
                  type="text"
                  autoComplete="organization-title"
                  placeholder={t.positionPlaceholder}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  aria-invalid={!!errors.position}
                  aria-describedby={errors.position ? "position-error" : undefined}
                />
              </Field>

              <fieldset
                className="flex flex-col gap-3"
                aria-invalid={!!errors.industries}
                aria-describedby={errors.industries ? "industries-error" : undefined}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <legend className="text-sm font-medium">
                    {t.industries}
                    <RequiredStar label={t.requiredMark} />
                  </legend>
                  <span className="text-xs text-muted-foreground">
                    {t.industriesHint}
                  </span>
                </div>
                <div
                  className={cn(
                    "grid grid-cols-1 gap-1 rounded-3xl bg-muted/40 p-2 sm:grid-cols-2",
                    errors.industries && "ring-1 ring-destructive/40"
                  )}
                >
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
                            : "text-foreground/80 hover:bg-card/60"
                        )}
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={(value) =>
                            toggleIndustry(item.value as IndustryValue, value === true)
                          }
                        />
                        <span className="leading-snug">{item.label[lang]}</span>
                      </label>
                    )
                  })}
                </div>
                {errors.industries && (
                  <FieldError id="industries-error">{errors.industries}</FieldError>
                )}
              </fieldset>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="consent"
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground transition-colors hover:bg-muted/60",
                    errors.consent && "ring-1 ring-destructive/40"
                  )}
                >
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(value) => setConsent(value === true)}
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-0.5"
                  />
                  <span>
                    {t.consent}
                    <RequiredStar label={t.requiredMark} />
                  </span>
                </label>
                {errors.consent && (
                  <FieldError id="consent-error">{errors.consent}</FieldError>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-2 h-12 w-full text-base font-semibold"
                disabled={pending}
              >
                {t.submit}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground text-balance">
          © {new Date().getFullYear()} {t.footer}
        </p>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  required,
  requiredLabel,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  requiredLabel?: string
  error?: string | null
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <RequiredStar label={requiredLabel} />}
      </Label>
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}

function RequiredStar({ label }: { label?: string }) {
  return (
    <span aria-label={label} className="ml-1 text-destructive" aria-hidden={!label}>
      *
    </span>
  )
}

function FieldError({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {children}
    </p>
  )
}

function LangLink({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-2 py-1 transition-colors",
        active
          ? "font-semibold text-foreground"
          : "text-muted-foreground/80 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function LangSeparator() {
  return <span aria-hidden className="text-muted-foreground/40">|</span>
}

function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: Theme
  setTheme: (next: Theme) => void
}) {
  return (
    <div
      role="group"
      aria-label="Theme"
      className="relative inline-flex items-center rounded-full bg-card p-1 shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-pressed={theme === "dark"}
        aria-label="Dark mode"
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-full transition-colors",
          theme === "dark"
            ? "bg-foreground text-background hover:bg-foreground hover:text-background"
            : "bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
        )}
      >
        <RiMoonLine className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-pressed={theme === "light"}
        aria-label="Light mode"
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-full transition-colors",
          theme === "light"
            ? "bg-foreground text-background hover:bg-foreground hover:text-background"
            : "bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
        )}
      >
        <RiSunLine className="size-4" />
      </Button>
    </div>
  )
}
