export type Lang = "uz" | "ru" | "en"

export const LANGS: readonly Lang[] = ["uz", "ru", "en"] as const

export const INDUSTRY_VALUES = [
  "it",
  "agriculture",
  "energy",
  "construction",
  "trade",
  "manufacturing",
  "healthcare",
  "logistics",
  "textile",
  "food",
  "other",
] as const

export type IndustryValue = (typeof INDUSTRY_VALUES)[number]

export const INDUSTRIES: { value: IndustryValue; label: Record<Lang, string> }[] = [
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

export function industryLabel(value: string, lang: Lang = "en"): string {
  const found = INDUSTRIES.find((i) => i.value === value)
  return found ? found.label[lang] : value
}
