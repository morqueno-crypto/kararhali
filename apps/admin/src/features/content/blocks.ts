import type { ContentKey } from '@karar-hali/shared'

/*
 * İçerik düzenleyicinin alan yapılandırması.
 * Doğrulama paylaşılan şemadan (contentBlockSchemas) gelir; burası yalnızca
 * hangi alanın hangi kontrolle ve hangi etiketle gösterileceğini tanımlar.
 */

export type FieldType =
  'text' | 'textarea' | 'image' | 'stringList' | 'imageList' | 'items' | 'stats'

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  hint?: string
}

export interface BlockDef {
  title: string
  description: string
  group: BlockGroup
  /** Sitedeki Türkçe yol (önizleme bağlantısı) */
  sitePath: string
  fields: FieldDef[]
}

export const blockGroups = ['Ana sayfa', 'Kurumsal', 'Üretim', 'Diğer sayfalar'] as const
export type BlockGroup = (typeof blockGroups)[number]

const heading: FieldDef[] = [
  { name: 'eyebrow', label: 'Üst başlık', type: 'text', hint: 'Başlığın üstündeki küçük etiket' },
  { name: 'title', label: 'Başlık', type: 'text' },
  {
    name: 'titleAccent',
    label: 'Vurgulu kısım',
    type: 'text',
    hint: 'Başlıkta altın renkle vurgulanacak kelime(ler); başlıkta aynen geçmeli. Boş bırakılabilir.',
  },
]

export const blockDefs: Record<ContentKey, BlockDef> = {
  'home.hero': {
    title: 'Giriş bölümü',
    description: 'Ana sayfanın en üstündeki büyük başlık, metin ve görsel.',
    group: 'Ana sayfa',
    sitePath: '/tr',
    fields: [
      ...heading,
      { name: 'text', label: 'Metin', type: 'textarea' },
      { name: 'primaryCta', label: 'Ana buton', type: 'text' },
      { name: 'secondaryCta', label: 'İkinci buton', type: 'text' },
      { name: 'image', label: 'Görsel', type: 'image' },
      {
        name: 'imageAlt',
        label: 'Görsel açıklaması',
        type: 'text',
        hint: 'Ekran okuyucular ve arama motorları için',
      },
    ],
  },
  'home.featured': {
    title: 'Öne çıkan koleksiyonlar',
    description: 'Öne çıkarılan koleksiyonların gösterildiği bölümün başlığı.',
    group: 'Ana sayfa',
    sitePath: '/tr',
    fields: [
      ...heading,
      { name: 'description', label: 'Açıklama', type: 'textarea' },
      { name: 'cta', label: 'Buton metni', type: 'text' },
    ],
  },
  'home.categories': {
    title: 'Kategoriler',
    description: 'Halı ve rulo kesim kategorilerini tanıtan iki kart.',
    group: 'Ana sayfa',
    sitePath: '/tr',
    fields: [
      { name: 'carpetsTitle', label: 'Halı başlığı', type: 'text' },
      { name: 'carpetsText', label: 'Halı metni', type: 'textarea' },
      { name: 'carpetsImage', label: 'Halı görseli', type: 'image' },
      { name: 'rollsTitle', label: 'Rulo kesim başlığı', type: 'text' },
      { name: 'rollsText', label: 'Rulo kesim metni', type: 'textarea' },
      { name: 'rollsImage', label: 'Rulo kesim görseli', type: 'image' },
      { name: 'cta', label: 'Buton metni', type: 'text' },
    ],
  },
  'home.story': {
    title: 'Hikâye',
    description: 'Ana sayfadaki kısa firma tanıtımı.',
    group: 'Ana sayfa',
    sitePath: '/tr',
    fields: [
      ...heading,
      { name: 'text', label: 'Metin', type: 'textarea' },
      { name: 'cta', label: 'Buton metni', type: 'text' },
    ],
  },
  'home.values': {
    title: 'Değerler başlığı',
    description: 'Ana sayfadaki değerler bölümünün başlığı. Maddeler "Değerler" bloğundan gelir.',
    group: 'Ana sayfa',
    sitePath: '/tr',
    fields: heading,
  },
  'about.page': {
    title: 'Kurumsal sayfası',
    description: 'Kurumsal sayfasının başlıkları, hikâye paragrafları ve fuar görselleri.',
    group: 'Kurumsal',
    sitePath: '/tr/kurumsal',
    fields: [
      ...heading,
      { name: 'description', label: 'Açıklama', type: 'textarea' },
      { name: 'image', label: 'Görsel', type: 'image' },
      { name: 'storyEyebrow', label: 'Hikâye üst başlığı', type: 'text' },
      { name: 'storyTitle', label: 'Hikâye başlığı', type: 'text' },
      { name: 'story', label: 'Hikâye paragrafları', type: 'stringList' },
      { name: 'pillarsEyebrow', label: 'Temel taşlar üst başlığı', type: 'text' },
      { name: 'pillarsTitle', label: 'Temel taşlar başlığı', type: 'text' },
      { name: 'valuesEyebrow', label: 'Değerler üst başlığı', type: 'text' },
      { name: 'valuesTitle', label: 'Değerler başlığı', type: 'text' },
      { name: 'fairsEyebrow', label: 'Fuarlar üst başlığı', type: 'text' },
      { name: 'fairsTitle', label: 'Fuarlar başlığı', type: 'text' },
      { name: 'fairsText', label: 'Fuarlar metni', type: 'textarea' },
      { name: 'fairImages', label: 'Fuar görselleri', type: 'imageList' },
    ],
  },
  'company.stats': {
    title: 'Rakamlar',
    description: 'Kuruluş yılı, kapasite gibi öne çıkan sayılar.',
    group: 'Kurumsal',
    sitePath: '/tr/kurumsal',
    fields: [{ name: 'items', label: 'Rakamlar', type: 'stats' }],
  },
  'company.values': {
    title: 'Değerler',
    description: 'Firma değerleri (ana sayfa ve kurumsal sayfasında).',
    group: 'Kurumsal',
    sitePath: '/tr/kurumsal',
    fields: [{ name: 'items', label: 'Değerler', type: 'items' }],
  },
  'company.pillars': {
    title: 'Temel taşlar',
    description: 'Kurumsal sayfasındaki temel taşlar.',
    group: 'Kurumsal',
    sitePath: '/tr/kurumsal',
    fields: [{ name: 'items', label: 'Temel taşlar', type: 'items' }],
  },
  'production.page': {
    title: 'Üretim sayfası',
    description: 'Üretim sayfasının başlıkları, metinleri ve görselleri.',
    group: 'Üretim',
    sitePath: '/tr/uretim',
    fields: [
      ...heading,
      { name: 'description', label: 'Açıklama', type: 'textarea' },
      { name: 'image', label: 'Görsel', type: 'image' },
      { name: 'processEyebrow', label: 'Süreç üst başlığı', type: 'text' },
      { name: 'processTitle', label: 'Süreç başlığı', type: 'text' },
      { name: 'processDescription', label: 'Süreç açıklaması', type: 'textarea' },
      { name: 'typesEyebrow', label: 'Ürün tipleri üst başlığı', type: 'text' },
      { name: 'typesTitle', label: 'Ürün tipleri başlığı', type: 'text' },
      { name: 'carpetsText', label: 'Halı metni', type: 'textarea' },
      { name: 'carpetsImage', label: 'Halı görseli', type: 'image' },
      { name: 'rollsText', label: 'Rulo kesim metni', type: 'textarea' },
      { name: 'rollsImage', label: 'Rulo kesim görseli', type: 'image' },
    ],
  },
  'production.steps': {
    title: 'Üretim adımları',
    description: 'Üretim sürecinin adım adım anlatımı.',
    group: 'Üretim',
    sitePath: '/tr/uretim',
    fields: [{ name: 'items', label: 'Adımlar', type: 'items' }],
  },
  'collections.page': {
    title: 'Koleksiyonlar sayfası',
    description: 'Koleksiyon listesi sayfasının başlığı.',
    group: 'Diğer sayfalar',
    sitePath: '/tr/koleksiyonlar',
    fields: [...heading, { name: 'description', label: 'Açıklama', type: 'textarea' }],
  },
  'contact.page': {
    title: 'İletişim sayfası',
    description: 'İletişim sayfasının başlığı. Adres ve telefon site ayarlarından gelir.',
    group: 'Diğer sayfalar',
    sitePath: '/tr/iletisim',
    fields: [
      { name: 'eyebrow', label: 'Üst başlık', type: 'text' },
      { name: 'title', label: 'Başlık', type: 'text' },
      { name: 'description', label: 'Açıklama', type: 'textarea' },
    ],
  },
  cta: {
    title: 'Çağrı bandı',
    description: 'Sayfa altlarındaki "bizimle iletişime geçin" bandı.',
    group: 'Diğer sayfalar',
    sitePath: '/tr',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text' },
      { name: 'text', label: 'Metin', type: 'textarea' },
      { name: 'button', label: 'Buton metni', type: 'text' },
    ],
  },
}

/** Yeni (henüz kaydı olmayan) blok için boş değerler */
export function emptyBlock(def: BlockDef) {
  const locale = Object.fromEntries(
    def.fields.map((field) => [
      field.name,
      field.type === 'text' || field.type === 'textarea' || field.type === 'image' ? '' : [],
    ]),
  )
  return { tr: locale, en: structuredClone(locale) }
}
