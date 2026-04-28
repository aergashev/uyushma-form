"use client"

import * as React from "react"
import Image from "next/image"
import { RiMoonLine, RiSunLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import Logo from "../../public/logo.png"

type Lang = "uz" | "ru" | "en"

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
  },
} as const

const INDUSTRIES: { value: string; label: Record<Lang, string> }[] = [
  { value: "it", label: { uz: "IT va raqamli texnologiyalar", ru: "ИТ и цифровые технологии", en: "IT and Digital Technologies" } },
  { value: "agriculture", label: { uz: "Qishloq xo‘jaligi", ru: "Сельское хозяйство", en: "Agriculture" } },
  { value: "energy", label: { uz: "Energetika", ru: "Энергетика", en: "Energy" } },
  { value: "construction", label: { uz: "Qurilish", ru: "Строительство", en: "Construction" } },
  { value: "trade", label: { uz: "Savdo va xizmatlar", ru: "Торговля и услуги", en: "Trade and Services" } },
  { value: "manufacturing", label: { uz: "Sanoat / ishlab chiqarish", ru: "Промышленность / производство", en: "Industry / Manufacturing" } },
  { value: "healthcare", label: { uz: "Sog‘liqni saqlash", ru: "Здравоохранение", en: "Healthcare" } },
  { value: "logistics", label: { uz: "Logistika", ru: "Логистика", en: "Logistics" } },
  { value: "textile", label: { uz: "To‘qimachilik", ru: "Текстиль", en: "Textile" } },
  { value: "food", label: { uz: "Oziq-ovqat sanoati", ru: "Пищевая промышленность", en: "Food Industry" } },
  { value: "other", label: { uz: "Boshqa", ru: "Другое", en: "Other" } },
]

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
  const [industries, setIndustries] = React.useState<string[]>([])
  const [consent, setConsent] = React.useState(false)

  const canSubmit =
    fullName.trim() &&
    phone.trim() &&
    company.trim() &&
    position.trim() &&
    industries.length > 0 &&
    consent

  function toggleIndustry(value: string, checked: boolean) {
    setIndustries((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    )
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Field id="fullName" label={t.fullName}>
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder={t.fullNamePlaceholder}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Field>

              <Field id="phone" label={t.phone}>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Field>

              <Field id="company" label={t.company}>
                <Input
                  id="company"
                  type="text"
                  autoComplete="organization"
                  placeholder={t.companyPlaceholder}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </Field>

              <Field id="position" label={t.position}>
                <Input
                  id="position"
                  type="text"
                  autoComplete="organization-title"
                  placeholder={t.positionPlaceholder}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </Field>

              <fieldset className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-2">
                  <legend className="text-sm font-medium">{t.industries}</legend>
                  <span className="text-xs text-muted-foreground">
                    {t.industriesHint}
                  </span>
                </div>
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
                            : "text-foreground/80 hover:bg-card/60"
                        )}
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={(value) =>
                            toggleIndustry(item.value, value === true)
                          }
                        />
                        <span className="leading-snug">{item.label[lang]}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <label
                htmlFor="consent"
                className="flex cursor-pointer items-start gap-3 rounded-2xl bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground transition-colors hover:bg-muted/60"
              >
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(value) => setConsent(value === true)}
                  className="mt-0.5"
                />
                <span>{t.consent}</span>
              </label>

              <Button
                type="submit"
                size="lg"
                className="mt-2 h-12 w-full text-base font-semibold"
                disabled={!canSubmit}
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
