import type { Localized } from '@/i18n'

interface Item {
  title: string
  text: string
}

interface Stat {
  value: string
  label: string
}

export interface CompanyContent {
  stats: Stat[]
  pillars: Item[]
  values: Item[]
  productionSteps: Item[]
}

/** Görseller (asset köküne göre). */
export const companyImages = {
  hero: 'project/koleksiyonlar.jpg',
  carpets: 'project/koleksiyonlar.jpg',
  rolls: 'project/rulo.jpg',
  catalogs: 'project/kataloglar.jpg',
  craft: 'agency-1.jpg',
  fairs: [
    'project/galeri/fuar1.jpg',
    'project/galeri/fuar2.jpg',
    'project/galeri/fuar3.png',
    'project/galeri/fuar4.jpg',
  ],
} as const

// Kuruluş yılı, vizyon ve iş planı metinleri kararhali.com/hakkimizda sayfasından uyarlanmıştır.
export const companyContent: Localized<CompanyContent> = {
  tr: {
    stats: [
      { value: '1966', label: 'Kuruluş yılı' },
      { value: '60 yıl', label: 'Tekstil deneyimi' },
      { value: '22', label: 'Koleksiyon' },
      { value: '~300', label: 'Halı modeli' },
    ],
    pillars: [
      {
        title: 'İş planı',
        text: 'İş ahlakı, özveri ve disiplini kılavuz edinen Karar Tekstil, halıyı yer döşemesinin ötesinde bir dekorasyon aracı olarak görür.',
      },
      {
        title: 'Müşteri memnuniyeti',
        text: 'Kaliteli ve her yıl çeşitliliği artan ürünleriyle müşteriyi memnun etmeyi temel amaç edinmiştir.',
      },
      {
        title: 'Kurumsal vizyon',
        text: 'Tasarım çalışmalarıyla Türkiye’de örnek alınan, globalleşen dünyaya uyum sağlayan, sektörde söz sahibi bir firma olmak.',
      },
    ],
    values: [
      {
        title: 'Özgün tasarım',
        text: 'Kendi bünyemizdeki tasarım ekibiyle eşsiz desenler geliştiriyoruz.',
      },
      {
        title: 'Son teknoloji',
        text: 'Üretimde son teknoloji tezgâhlar ve en iyi malzemeyi kullanıyoruz.',
      },
      {
        title: 'Geniş ürün yelpazesi',
        text: 'Halıdan rulo kesime, klasikten moderne her beğeniye uygun ürün sunuyoruz.',
      },
      {
        title: 'Bölgeye katkı',
        text: 'Yatırımlarımızla bölge insanına istihdam sağlıyor, kalkınmaya katkıda bulunuyoruz.',
      },
    ],
    productionSteps: [
      {
        title: 'Tasarım',
        text: 'Tasarım ekibimiz trendleri ve müşteri beklentilerini özgün desen ve renklere dönüştürür.',
      },
      {
        title: 'İplik hazırlığı',
        text: 'Seçilen iplikler renk reçetesine göre hazırlanır ve kalite testlerinden geçirilir.',
      },
      {
        title: 'Dokuma',
        text: 'Desenler son teknoloji dokuma tezgâhlarında ilmek ilmek halıya işlenir.',
      },
      {
        title: 'Bitiş işlemleri',
        text: 'Halılar tıraşlanır, yıkanır ve kenar işlemleriyle son hâlini alır.',
      },
      {
        title: 'Kalite kontrol',
        text: 'Her ürün ölçü, renk ve yüzey kontrolünden geçtikten sonra onaylanır.',
      },
      {
        title: 'Sevkiyat',
        text: 'Ürünler özenle paketlenerek bayilerimize ve müşterilerimize ulaştırılır.',
      },
    ],
  },
  en: {
    stats: [
      { value: '1966', label: 'Founded' },
      { value: '60 years', label: 'Textile experience' },
      { value: '22', label: 'Collections' },
      { value: '~300', label: 'Carpet models' },
    ],
    pillars: [
      {
        title: 'Business plan',
        text: 'Guided by business ethics, dedication and discipline, Karar Tekstil sees carpets as a decor element beyond floor covering.',
      },
      {
        title: 'Customer satisfaction',
        text: 'Our core aim is to satisfy customers with quality products whose variety grows every year.',
      },
      {
        title: 'Corporate vision',
        text: 'To be a leading voice in the industry, setting the standard in design in Türkiye and adapting to a globalising world.',
      },
    ],
    values: [
      {
        title: 'Original design',
        text: 'Our in-house design team develops unique patterns.',
      },
      {
        title: 'Latest technology',
        text: 'We use state-of-the-art looms and the finest materials in production.',
      },
      {
        title: 'Wide product range',
        text: 'From carpets to roll-cut runners, classic to modern, we offer something for every taste.',
      },
      {
        title: 'Regional impact',
        text: 'Through our investments we create local jobs and contribute to regional development.',
      },
    ],
    productionSteps: [
      {
        title: 'Design',
        text: 'Our design team turns trends and customer expectations into original patterns and colours.',
      },
      {
        title: 'Yarn preparation',
        text: 'Selected yarns are prepared to colour recipes and pass quality tests.',
      },
      {
        title: 'Weaving',
        text: 'Patterns are woven knot by knot on state-of-the-art looms.',
      },
      {
        title: 'Finishing',
        text: 'Carpets are sheared, washed and edge-finished into their final form.',
      },
      {
        title: 'Quality control',
        text: 'Every product is approved only after size, colour and surface checks.',
      },
      {
        title: 'Shipping',
        text: 'Products are carefully packed and delivered to our dealers and customers.',
      },
    ],
  },
}
