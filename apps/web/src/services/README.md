# services

API ile konuşan tek katman. Bileşenler ve route loader'ları veriyi yalnızca buradaki fonksiyonlardan alır; `fetch` başka yerde çağrılmaz.

- `site.ts`: `/api/v1/site`. Ayarlar ve tüm içerik blokları; dil route'unun loader'ında bir kez yüklenir, `src/site` context'i ile dağıtılır.
- `collections.ts`: koleksiyonlar, koleksiyon detayı, model detayı.
- `contact.ts`: iletişim formu (anlık doğrulama şeması + gönderim).

İstekler `@/lib/http` üzerinden yapılır. API'nin hata gövdesi `HttpError`'a çevrilir. `httpOptional` 404'ü `undefined` olarak döner.
