import { z } from 'zod'

/**
 * owner: ana kullanıcı; tek kişi. Kullanıcı açma/kapama yetkisi YALNIZCA owner'dadır.
 * admin: içerik, ayarlar, mesajlar.
 * editor: içerik ve medya.
 */
export const roles = ['owner', 'admin', 'editor'] as const
export const roleSchema = z.enum(roles)
export type Role = z.infer<typeof roleSchema>

/** owner'ın panelden atayabileceği roller (ikinci bir owner açılamaz). */
export const assignableRoleSchema = z.enum(['admin', 'editor'])

const email = z.email().trim().toLowerCase()
export const passwordSchema = z.string().min(10, 'Şifre en az 10 karakter olmalı').max(200)

export const loginInputSchema = z.object({
  email,
  password: z.string().min(1).max(200),
})

export const createUserInputSchema = z.object({
  email,
  name: z.string().trim().min(2).max(80),
  password: passwordSchema,
  role: assignableRoleSchema,
})

export const updateUserInputSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    role: assignableRoleSchema,
    active: z.boolean(),
    /** owner başka bir kullanıcının şifresini sıfırlayabilir. */
    password: passwordSchema,
  })
  .partial()

export const changePasswordInputSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: passwordSchema,
})

export interface PublicUser {
  id: number
  email: string
  name: string
  role: Role
  active: boolean
  lastLoginAt: string | null
  createdAt: string
}
