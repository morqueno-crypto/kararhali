// Arayüz metinleri (Türkçe). en.ts aynı yapıyı birebir uygulamak zorundadır.
export const tr = {
  meta: {
    tagline: 'Modern halı üretiminde ustalık',
    description:
      'Karar Halı; tasarımdan dokumaya, kalite kontrolden ihracata kadar tüm süreçleri kendi tesislerinde yöneten modern bir halı üreticisidir.',
  },
  nav: {
    home: 'Ana sayfa',
    about: 'Kurumsal',
    collections: 'Koleksiyonlar',
    production: 'Üretim',
    contact: 'İletişim',
  },
  common: {
    getQuote: 'Teklif Alın',
    skipToContent: 'İçeriğe geç',
    openMenu: 'Menüyü aç',
    closeMenu: 'Menüyü kapat',
    mainMenu: 'Ana menü',
    mobileMenu: 'Mobil menü',
    homeLink: (name: string) => `${name} ana sayfa`,
    language: 'Dil seçimi',
    backHome: 'Ana sayfaya dön',
  },
  footer: {
    pages: 'Sayfalar',
    contact: 'İletişim',
    rights: 'Tüm hakları saklıdır.',
    demo: 'Bu site tanıtım amaçlı bir demodur; içerikler örnektir.',
  },
  contactInfo: {
    address: 'Organize Sanayi Bölgesi, 4. Cadde No: 12, Şehitkamil / Gaziantep',
    hours: 'Pazartesi – Cuma, 08:30 – 18:00',
  },
  home: {
    hero: {
      eyebrow: '1987’den beri halı üretimi',
      titleStart: 'İlmek ilmek,',
      titleAccent: 'modern',
      titleEnd: 'zanaat.',
      text: 'Tasarımdan dokumaya, kalite kontrolden sevkiyata kadar tüm süreci kendi tesislerimizde yönetiyor; 40’ı aşkın ülkeye ev, otel ve ofis halısı üretiyoruz.',
      primary: 'Koleksiyonları keşfedin',
      secondary: 'Üretim tesisimiz',
      swatchTitle: (name: string) => `${name} koleksiyonu`,
    },
    collections: {
      eyebrow: 'Koleksiyonlar',
      title: 'Her mekâna uygun bir dokuma',
      description:
        'Klasik madalyonlardan minimalist düz dokumalara, kilimden dış mekân serilerine kadar geniş ürün yelpazesi.',
      cta: 'Tümünü görün',
    },
    production: {
      eyebrow: 'Üretim',
      title: 'İplikten sevkiyata, tek çatı altında',
      description:
        'Altı aşamalı üretim sürecimizin her adımı kendi tesisimizde, kendi ekibimizle yürütülür.',
      cta: 'Süreci inceleyin',
    },
    values: {
      eyebrow: 'Değerlerimiz',
      title: 'Zanaatı geleceğe taşıyan ilkeler',
    },
  },
  cta: {
    title: 'Bayilik, ihracat ve proje çözümleri için bizimle çalışın.',
    text: 'Otel, ofis ve perakende projelerinize özel ölçü, desen ve renk seçenekleriyle teklif hazırlayalım.',
    button: 'Teklif isteyin',
  },
  about: {
    metaDescription: 'Karar Halı’nın hikâyesi, değerleri ve 1987’den bugüne uzanan yolculuğu.',
    eyebrow: 'Kurumsal',
    title: 'Üç kuşaklık dokuma bilgisi, modern bir fabrikada.',
    description:
      '12 tezgâhlı bir atölyeden 40’ı aşkın ülkeye ihracat yapan entegre bir üretim tesisine uzanan hikâyemiz.',
    storyEyebrow: 'Hikâyemiz',
    storyTitle: 'Zanaatı ölçeklendirmek',
    story: [
      'Karar Halı, 1987 yılında Gaziantep’te küçük bir aile atölyesi olarak kuruldu. Bugün 45.000 m² kapalı alanda, 450’yi aşkın çalışanıyla yılda 3,5 milyon m² halı üretiyor.',
      'Ustalarımızın deneyimini dijital desen laboratuvarımız ve yüksek hassasiyetli dokuma tezgâhlarımızla birleştiriyor; ev, otel, ofis ve perakende sektörlerine tutarlı kalitede ürün sunuyoruz.',
      'Üretimin her aşamasında enerji, su ve hammadde verimliliğini ölçüyor; sürdürülebilirliği iş yapış biçimimizin merkezine koyuyoruz.',
    ],
    milestonesEyebrow: 'Kilometre taşları',
    milestonesTitle: 'Yolculuğumuz',
    valuesEyebrow: 'Değerlerimiz',
    valuesTitle: 'Bizi biz yapan ilkeler',
  },
  collections: {
    metaDescription: 'Klasik, modern, kilim ve dış mekân halı koleksiyonlarımızı keşfedin.',
    eyebrow: 'Koleksiyonlar',
    title: 'Desen, doku ve renk zenginliği',
    description:
      'Her koleksiyon kendi tasarım stüdyomuzda geliştirilir ve tesisimizde üretilir. Özel ölçü ve renk talepleri için bize ulaşın.',
    filterLabel: 'Kategoriye göre filtrele',
    all: 'Tümü',
    empty: 'Bu kategoride henüz koleksiyon bulunmuyor.',
    categories: {
      classic: 'Klasik',
      modern: 'Modern',
      kilim: 'Kilim',
      outdoor: 'Dış Mekân',
    },
  },
  collectionDetail: {
    back: 'Tüm koleksiyonlar',
    collectionOf: (category: string) => `${category} koleksiyonu`,
    swatchTitle: (name: string) => `${name} halı deseni`,
    specs: {
      category: 'Kategori',
      material: 'Malzeme',
      pileHeight: 'Hav yüksekliği',
      technique: 'Teknik',
    },
    sizes: 'Standart ölçüler',
    cta: 'Bu koleksiyon için teklif alın',
    othersEyebrow: 'Keşfetmeye devam edin',
    othersTitle: 'Diğer koleksiyonlar',
  },
  production: {
    metaDescription:
      'Entegre halı üretim tesisimiz, altı aşamalı üretim sürecimiz ve sertifikalarımız.',
    eyebrow: 'Üretim',
    title: 'Entegre tesis, kontrollü süreç.',
    description:
      'İplik boyamadan paketlemeye kadar her adım, Gaziantep Organize Sanayi Bölgesi’ndeki tesisimizde kendi ekiplerimizce yürütülür.',
    processEyebrow: 'Süreç',
    processTitle: 'Altı adımda bir halının yolculuğu',
    processDescription:
      'Her aşamada ölçülebilir kalite kriterleri uygulanır; ürünler bir sonraki aşamaya ancak bu kontrollerden geçtikten sonra ilerler.',
    facilityEyebrow: 'Tesis',
    facilityTitle: 'Rakamlarla üretim gücümüz',
    certEyebrow: 'Kalite ve sürdürülebilirlik',
    certTitle: 'Sertifikalarımız',
    certDescription:
      'Uluslararası standartlara uygun üretim yapıyor, süreçlerimizi düzenli olarak bağımsız kuruluşlara denetletiyoruz.',
  },
  contact: {
    metaDescription: 'Bayilik, ihracat ve proje talepleriniz için Karar Halı ile iletişime geçin.',
    eyebrow: 'İletişim',
    title: 'Projenizi konuşalım.',
    description:
      'Bayilik, ihracat veya otel/ofis projeleriniz için formu doldurun; satış ekibimiz bir iş günü içinde size dönüş yapsın.',
    info: {
      address: 'Adres',
      phone: 'Telefon',
      email: 'E-posta',
      hours: 'Çalışma saatleri',
    },
    form: {
      name: 'Ad Soyad',
      email: 'E-posta',
      company: 'Firma (isteğe bağlı)',
      subject: 'Konu',
      message: 'Mesajınız',
      submit: 'Mesajı Gönder',
      sending: 'Gönderiliyor…',
    },
    subjects: {
      dealership: 'Bayilik',
      export: 'İhracat',
      project: 'Proje / Otel',
      other: 'Diğer',
    },
    validation: {
      name: 'Lütfen adınızı girin.',
      email: 'Geçerli bir e-posta adresi girin.',
      message: 'Mesajınız en az 10 karakter olmalı.',
    },
    success: {
      title: 'Mesajınız alındı',
      text: 'Teşekkür ederiz. Satış ekibimiz en kısa sürede sizinle iletişime geçecek.',
      note: 'Not: Bu bir demo sitedir, form gerçekte bir yere gönderilmez.',
    },
  },
  notFound: {
    metaTitle: 'Sayfa bulunamadı',
    title: 'Sayfa bulunamadı',
    text: 'Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.',
  },
  error: {
    title: 'Bir şeyler ters gitti',
    text: 'Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.',
  },
}

export type Messages = typeof tr
