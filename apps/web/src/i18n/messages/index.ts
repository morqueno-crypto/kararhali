import type { Locale } from '../config'
import { en } from './en'
import { tr, type Messages } from './tr'

export const messages: Record<Locale, Messages> = { tr, en }

export type { Messages }
