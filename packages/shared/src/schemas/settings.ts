import { z } from 'zod'
import { imageRefSchema, localizedLongText, localizedText } from './common'

const optionalUrl = z.union([z.url(), z.literal('')]).default('')

export const settingSchemas = {
  general: z.object({
    siteName: z.string().trim().min(1).max(80),
    logo: imageRefSchema,
    tagline: localizedText,
    description: localizedLongText,
    dealerLoginUrl: optionalUrl,
  }),
  contact: z.object({
    phone: z.string().trim().min(5).max(40),
    phoneLines: z.string().trim().min(5).max(80),
    fax: z.string().trim().max(40).default(''),
    email: z.email(),
    address: localizedText,
    hours: localizedText,
  }),
  social: z.object({
    instagram: optionalUrl,
    facebook: optionalUrl,
    linkedin: optionalUrl,
    youtube: optionalUrl,
  }),
} as const

export type SettingKey = keyof typeof settingSchemas
export const settingKeys = Object.keys(settingSchemas) as SettingKey[]
export const settingKeySchema = z.enum(settingKeys as [SettingKey, ...SettingKey[]])
export type Settings = { [K in SettingKey]: z.infer<(typeof settingSchemas)[K]> }
