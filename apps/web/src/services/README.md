# services

Veri erişim katmanı. Bileşenler ve route loader'ları veriyi yalnızca buradaki fonksiyonlardan alır.

- Şimdi: fonksiyonlar `src/data/` altındaki statik veriyi `async` olarak döner.
- Backend gelince: aynı imzayla `@/lib/http` üzerinden API çağrısına çevrilir; bileşenler değişmez.
