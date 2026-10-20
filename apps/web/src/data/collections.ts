import type { CollectionRecord } from '@/types/collection'

// Örnek (dummy) koleksiyon verisi. Backend gelince API'den gelecek.
export const collections: CollectionRecord[] = [
  {
    slug: 'anadolu-miras',
    category: 'classic',
    pattern: 'medallion',
    palette: ['#8f2f1f', '#e9d8b8', '#1f2a44'],
    sizes: ['160 × 230 cm', '200 × 290 cm', '250 × 350 cm', '300 × 400 cm'],
    featured: true,
    name: { tr: 'Anadolu Miras', en: 'Anatolian Heritage' },
    summary: {
      tr: 'Geleneksel madalyon desenlerinin çağdaş yorumu.',
      en: 'A contemporary take on traditional medallion patterns.',
    },
    description: {
      tr: 'Anadolu dokuma geleneğinden ilham alan Anadolu Miras, kök boya tonlarını yüksek yoğunluklu modern dokuma tekniğiyle buluşturur. Merkezdeki madalyon ve çok katmanlı bordürler her mekâna köklü bir karakter kazandırır.',
      en: 'Inspired by Anatolian weaving traditions, Anatolian Heritage pairs natural-dye tones with high-density modern weaving. The central medallion and layered borders give any space a deep-rooted character.',
    },
    material: { tr: '%100 Yün', en: '100% Wool' },
    pileHeight: { tr: '10 mm', en: '10 mm' },
    technique: { tr: 'Wilton jakar dokuma', en: 'Wilton jacquard weaving' },
    features: {
      tr: ['Doğal yün lifi', 'Kök boya tonları', 'Yüksek düğüm yoğunluğu', 'Uzun ömürlü kullanım'],
      en: ['Natural wool fibre', 'Natural-dye tones', 'High knot density', 'Long-lasting use'],
    },
  },
  {
    slug: 'nordik-lin',
    category: 'modern',
    pattern: 'stripe',
    palette: ['#e8e0d2', '#b9a589', '#5d5346'],
    sizes: ['120 × 180 cm', '160 × 230 cm', '200 × 290 cm'],
    featured: true,
    name: { tr: 'Nordik Lin', en: 'Nordic Linen' },
    summary: {
      tr: 'Sade çizgiler, yumuşak toprak tonları.',
      en: 'Clean lines, soft earthy tones.',
    },
    description: {
      tr: 'İskandinav sadeliğini keten dokusuyla birleştiren Nordik Lin, minimalist yaşam alanları için tasarlandı. İnce şerit kompozisyonu mekânı sakinleştirir, nötr paleti her mobilyayla uyum sağlar.',
      en: 'Combining Scandinavian simplicity with a linen texture, Nordic Linen is designed for minimalist living spaces. Its fine stripes calm the room and its neutral palette suits any furniture.',
    },
    material: { tr: 'Yün – Keten karışım', en: 'Wool – linen blend' },
    pileHeight: { tr: '6 mm', en: '6 mm' },
    technique: { tr: 'Düz dokuma', en: 'Flatweave' },
    features: {
      tr: ['Nefes alan doğal lifler', 'Hafif ve kolay taşınır', 'Alerji dostu', 'Yıkanabilir'],
      en: ['Breathable natural fibres', 'Light and easy to move', 'Allergy-friendly', 'Washable'],
    },
  },
  {
    slug: 'geometrik-kilim',
    category: 'kilim',
    pattern: 'geometric',
    palette: ['#1f2a44', '#d9a441', '#c2532f'],
    sizes: ['80 × 150 cm', '120 × 180 cm', '160 × 230 cm'],
    featured: true,
    name: { tr: 'Geometrik Kilim', en: 'Geometric Kilim' },
    summary: {
      tr: 'Cesur baklava motifleri, çift taraflı kullanım.',
      en: 'Bold diamond motifs, reversible use.',
    },
    description: {
      tr: 'Göçebe kilim motiflerinin güçlü geometrisi, çağdaş renk paletiyle yeniden yorumlandı. Havsız yapısı ve çift taraflı kullanımıyla hem pratik hem dekoratif.',
      en: 'The strong geometry of nomadic kilim motifs, reinterpreted in a contemporary palette. Pile-free and reversible, it is both practical and decorative.',
    },
    material: { tr: 'Yün – Pamuk', en: 'Wool – cotton' },
    pileHeight: { tr: 'Havsız', en: 'Pile-free' },
    technique: { tr: 'El tezgâhı kilim dokuma', en: 'Hand-loom kilim weaving' },
    features: {
      tr: [
        'Çift taraflı kullanım',
        'Havsız, ince yapı',
        'Yoğun renk kalıcılığı',
        'El işçiliği detayları',
      ],
      en: [
        'Reversible',
        'Thin, pile-free build',
        'Excellent colour fastness',
        'Handcrafted details',
      ],
    },
  },
  {
    slug: 'urban-grid',
    category: 'modern',
    pattern: 'grid',
    palette: ['#3a3d42', '#8a8f96', '#c9a227'],
    sizes: ['200 × 300 cm', '300 × 400 cm'],
    name: { tr: 'Urban Grid', en: 'Urban Grid' },
    summary: {
      tr: 'Ofis ve ticari alanlar için dayanıklı modüler desen.',
      en: 'A durable modular pattern for offices and commercial spaces.',
    },
    description: {
      tr: 'Yoğun trafikli alanlar için geliştirilen Urban Grid, leke tutmayan polyamid lifleri ve modüler ızgara deseniyle ofislerde, otellerde ve mağazalarda uzun yıllar ilk günkü görünümünü korur.',
      en: 'Developed for high-traffic areas, Urban Grid keeps its day-one look for years in offices, hotels and stores thanks to stain-resistant polyamide fibres and a modular grid pattern.',
    },
    material: { tr: 'Polyamid', en: 'Polyamide' },
    pileHeight: { tr: '7 mm', en: '7 mm' },
    technique: { tr: 'Tufting', en: 'Tufting' },
    features: {
      tr: [
        'Leke tutmaz yüzey',
        'Yanmazlık sertifikalı',
        'Yoğun trafiğe dayanıklı',
        'Projeye özel ölçü',
      ],
      en: [
        'Stain-resistant surface',
        'Fire-safety certified',
        'Built for heavy traffic',
        'Custom project sizes',
      ],
    },
  },
  {
    slug: 'saray',
    category: 'classic',
    pattern: 'medallion',
    palette: ['#1f3b4d', '#d8c49a', '#7a2e3a'],
    sizes: ['200 × 290 cm', '250 × 350 cm', '300 × 400 cm'],
    name: { tr: 'Saray', en: 'Palace' },
    summary: {
      tr: 'İpek parlaklığında, ince işçilikli klasik.',
      en: 'A finely crafted classic with a silken sheen.',
    },
    description: {
      tr: 'Saray koleksiyonu, viskon ipek parlaklığı ve ince detaylı madalyon kompozisyonuyla salonlara zarafet katar. Işıkla değişen tonları sayesinde her açıdan farklı bir derinlik sunar.',
      en: 'With its viscose-silk sheen and finely detailed medallion composition, the Palace collection brings elegance to living rooms. Its light-shifting tones offer a different depth from every angle.',
    },
    material: { tr: 'Yün – Viskon', en: 'Wool – viscose' },
    pileHeight: { tr: '12 mm', en: '12 mm' },
    technique: { tr: 'Wilton jakar dokuma', en: 'Wilton jacquard weaving' },
    features: {
      tr: ['İpek parlaklığı', 'İnce detaylı desen', 'Yumuşak tutum', 'Salon ve otel lobileri için'],
      en: [
        'Silken sheen',
        'Finely detailed pattern',
        'Soft handle',
        'For living rooms and hotel lobbies',
      ],
    },
  },
  {
    slug: 'kum-tepesi',
    category: 'outdoor',
    pattern: 'stripe',
    palette: ['#d9c3a0', '#a7744a', '#4e6151'],
    sizes: ['120 × 170 cm', '160 × 230 cm', '200 × 290 cm'],
    name: { tr: 'Kum Tepesi', en: 'Dune' },
    summary: {
      tr: 'Güneşe ve neme dayanıklı dış mekân serisi.',
      en: 'An outdoor series that stands up to sun and moisture.',
    },
    description: {
      tr: 'Teras, bahçe ve havuz kenarları için tasarlanan Kum Tepesi, UV dayanımlı polipropilen lifleriyle solmaz, nem tutmaz ve kolayca temizlenir. Sıcak kum tonları açık havayla uyum içinde.',
      en: 'Designed for terraces, gardens and poolsides, Dune’s UV-resistant polypropylene fibres won’t fade, don’t hold moisture and clean easily. Its warm sand tones blend with the outdoors.',
    },
    material: { tr: 'Polipropilen', en: 'Polypropylene' },
    pileHeight: { tr: '4 mm', en: '4 mm' },
    technique: { tr: 'Düz dokuma', en: 'Flatweave' },
    features: {
      tr: ['UV dayanımı', 'Su geçirmez yapı', 'Hızlı kuruma', 'Hortumla yıkanabilir'],
      en: ['UV resistant', 'Water-resistant build', 'Quick drying', 'Hose washable'],
    },
  },
]
