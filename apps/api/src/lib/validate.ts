import { zValidator } from '@hono/zod-validator'
import type { ValidationTargets } from 'hono'
import { z } from 'zod'
import { errorBody } from './errors'

/**
 * zod doğrulayıcı; hata gövdesini ortak biçime çevirir:
 * { error: { code: 'validation_error', message, details: { alan: ['mesaj'] } } }
 */
export function validate<T extends z.ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        errorBody('validation_error', 'Gönderilen veri geçersiz', z.flattenError(result.error)),
        400,
      )
    }
  })
}
