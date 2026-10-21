const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*'

/** Tahmin edilemez şifre (crypto.getRandomValues; karışabilecek 0/O, 1/l/I hariç) */
export function generatePassword(length = 16) {
  const values = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join('')
}
