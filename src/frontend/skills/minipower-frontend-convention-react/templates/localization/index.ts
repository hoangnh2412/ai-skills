// Đích: src/features/{feature}/localization/index.ts — text UI lấy qua get{Feature}Messages(locale), không hard-code trong JSX.
import { enMessages } from './en'
import { viMessages, type {Feature}Messages } from './vi'

export type {Feature}Locale = 'vi' | 'en'
export type { {Feature}Messages }

export const {feature}Messages: Record<{Feature}Locale, {Feature}Messages> = {
  vi: viMessages,
  en: enMessages,
}

export function get{Feature}Messages(locale: {Feature}Locale = 'vi'): {Feature}Messages {
  return {feature}Messages[locale]
}
