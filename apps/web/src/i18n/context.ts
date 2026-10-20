import { createContext } from 'react'
import type { Locale } from './config'

export const LocaleContext = createContext<Locale | null>(null)
