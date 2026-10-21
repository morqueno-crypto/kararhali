import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { HttpError } from './http'

/**
 * API doğrulama hatalarını (details.fieldErrors) forma alan bazında yazar.
 * Uygulanan bir alan hatası varsa true döner (genel bildirim gerekmez).
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (!(error instanceof HttpError)) return false
  const entries = Object.entries(error.fieldErrors)
  for (const [field, messages] of entries) {
    if (messages[0]) setError(field as Path<T>, { type: 'server', message: messages[0] })
  }
  return entries.length > 0
}
