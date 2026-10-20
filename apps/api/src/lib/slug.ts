/** "6055A_KAHVE", "6054A A.GRI" → "6055a-kahve", "6054a-a-gri" */
export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
