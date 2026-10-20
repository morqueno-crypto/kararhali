import type { ContentBlock, ContentKey, Settings } from '@karar-hali/shared'

/** kararhali.com görsel kökü (seed anındaki görseller; panelden değiştirilebilir). */
const IMG = 'https://www.kararhali.com/assets/img'

type SeedContent = { [K in ContentKey]: ContentBlock<K> }

// Sitedeki mevcut TR/EN metinler. Kurumsal metinler kararhali.com/hakkimizda sayfasından uyarlanmıştır.
export const contentSeed: SeedContent = {
  'home.hero': {
    tr: {
      eyebrow: 'Gaziantep · 1966’dan beri',
      title: 'Kararsız kalmayın.',
      titleAccent: 'kalmayın.',
      text: 'Doğru seçilmiş bir halı evin havasını tamamen değiştirir. Modern, şık ve ihtişamlı koleksiyonlarımızla her mekâna uygun bir halı üretiyoruz.',
      primaryCta: 'Koleksiyonları keşfedin',
      secondaryCta: 'Hikâyemiz',
      image: `${IMG}/project/koleksiyonlar.jpg`,
      imageAlt: 'Karar Halı koleksiyonundan bir salon görünümü',
    },
    en: {
      eyebrow: 'Gaziantep · Since 1966',
      title: 'Decide with confidence.',
      titleAccent: 'confidence.',
      text: 'The right carpet completely changes the feel of a home. With our modern, elegant and grand collections, we make a carpet for every space.',
      primaryCta: 'Explore collections',
      secondaryCta: 'Our story',
      image: `${IMG}/project/koleksiyonlar.jpg`,
      imageAlt: 'A living room featuring a Karar Halı carpet',
    },
  },
  'home.featured': {
    tr: {
      eyebrow: 'Öne çıkanlar',
      title: 'Sezonun gözde koleksiyonları',
      titleAccent: 'gözde',
      description: 'Halı ve rulo kesim serilerimizden en çok tercih edilen tasarımlar.',
      cta: 'Tüm koleksiyonlar',
    },
    en: {
      eyebrow: 'Featured',
      title: 'This season’s favourite collections',
      titleAccent: 'favourite',
      description: 'The most popular designs from our carpet and roll-cut series.',
      cta: 'All collections',
    },
  },
  'home.categories': {
    tr: {
      carpetsTitle: 'Halı koleksiyonları',
      carpetsText: 'Modern, şık ve ihtişamlı halı modellerimiz salonlarınızı bekliyor.',
      carpetsImage: `${IMG}/project/koleksiyonlar.jpg`,
      rollsTitle: 'Rulo kesim koleksiyonları',
      rollsText: 'Koridordan mutfağa, evinizin her alanı için istediğiniz boyda kesilir.',
      rollsImage: `${IMG}/project/rulo.jpg`,
      cta: 'Göz atın',
    },
    en: {
      carpetsTitle: 'Carpet collections',
      carpetsText: 'Our modern, elegant and grand carpet designs are waiting for your living room.',
      carpetsImage: `${IMG}/project/koleksiyonlar.jpg`,
      rollsTitle: 'Roll-cut collections',
      rollsText: 'From hallways to kitchens, cut to the length you need for every room.',
      rollsImage: `${IMG}/project/rulo.jpg`,
      cta: 'Browse',
    },
  },
  'home.story': {
    tr: {
      eyebrow: 'Üretim hikâyesi',
      title: 'İplikten halıya, tek çatı altında.',
      titleAccent: 'halıya',
      text: 'Tasarım ekibimizin geliştirdiği özgün desenler, son teknoloji tezgâhlarda ilmek ilmek dokunur ve her aşamada kalite kontrolünden geçer.',
      cta: 'Üretim sürecimiz',
    },
    en: {
      eyebrow: 'Production story',
      title: 'From yarn to carpet, under one roof.',
      titleAccent: 'carpet',
      text: 'Original patterns created by our design team are woven knot by knot on state-of-the-art looms and quality-checked at every stage.',
      cta: 'Our production process',
    },
  },
  'home.values': {
    tr: {
      eyebrow: 'Neden Karar Halı',
      title: 'Altmış yıllık birikim, bugünün tasarımı',
      titleAccent: 'Altmış yıllık',
    },
    en: {
      eyebrow: 'Why Karar Halı',
      title: 'Sixty years of know-how, today’s design',
      titleAccent: 'Sixty years',
    },
  },
  'company.stats': {
    tr: {
      items: [
        { value: '1966', label: 'Kuruluş yılı' },
        { value: '60 yıl', label: 'Tekstil deneyimi' },
        { value: '22', label: 'Koleksiyon' },
        { value: '~300', label: 'Halı modeli' },
      ],
    },
    en: {
      items: [
        { value: '1966', label: 'Founded' },
        { value: '60 years', label: 'Textile experience' },
        { value: '22', label: 'Collections' },
        { value: '~300', label: 'Carpet models' },
      ],
    },
  },
  'company.pillars': {
    tr: {
      items: [
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
    },
    en: {
      items: [
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
    },
  },
  'company.values': {
    tr: {
      items: [
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
    },
    en: {
      items: [
        { title: 'Original design', text: 'Our in-house design team develops unique patterns.' },
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
    },
  },
  'production.steps': {
    tr: {
      items: [
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
      items: [
        {
          title: 'Design',
          text: 'Our design team turns trends and customer expectations into original patterns and colours.',
        },
        {
          title: 'Yarn preparation',
          text: 'Selected yarns are prepared to colour recipes and pass quality tests.',
        },
        { title: 'Weaving', text: 'Patterns are woven knot by knot on state-of-the-art looms.' },
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
  },
  'about.page': {
    tr: {
      eyebrow: 'Kurumsal',
      title: '1966’dan günümüze, ev tekstilinde köklü bir marka.',
      titleAccent: '1966’dan',
      description:
        'Gaziantep’te son teknoloji ve en iyi malzemeyle, özgün renk ve desenlerde halılar üretiyoruz.',
      image: `${IMG}/project/kataloglar.jpg`,
      storyEyebrow: 'Hikâyemiz',
      storyTitle: 'Altmış yıllık tekstil tecrübesi',
      story: [
        '1966 yılından bugüne tekstil sektöründe faaliyet gösteren firmamız, son kullanıcıya yönelik ev tekstili üreticisi olarak Gaziantep’te halı üretiyor.',
        'Üretimde son teknolojiyi ve en iyi malzemeyi kullanıyor; müşteri beklentilerine uygun özgün renk ve desenlerle ürettiğimiz ürünleri etkin pazarlama ağımızla beğeniye sunuyoruz.',
        'Kendi bünyemizdeki tasarım ekibiyle geliştirdiğimiz eşsiz desenleri modern dokuma teknikleriyle halılara işliyor, her beğeniye uygun ürünler sunuyoruz.',
      ],
      pillarsEyebrow: 'İlkelerimiz',
      pillarsTitle: 'Bizi biz yapan değerler',
      valuesEyebrow: 'Güçlü yönlerimiz',
      valuesTitle: 'Neden Karar Halı',
      fairsEyebrow: 'Fuarlar',
      fairsTitle: 'Sektörün buluşma noktalarındayız',
      fairsText:
        'Yurt içi ve yurt dışı fuarlarda yeni koleksiyonlarımızı iş ortaklarımızla buluşturuyoruz.',
      fairImages: [
        `${IMG}/project/galeri/fuar1.jpg`,
        `${IMG}/project/galeri/fuar2.jpg`,
        `${IMG}/project/galeri/fuar3.png`,
        `${IMG}/project/galeri/fuar4.jpg`,
      ],
    },
    en: {
      eyebrow: 'About us',
      title: 'Since 1966, an established name in home textiles.',
      titleAccent: '1966',
      description:
        'In Gaziantep, we produce carpets in original colours and patterns using the latest technology and the finest materials.',
      image: `${IMG}/project/kataloglar.jpg`,
      storyEyebrow: 'Our story',
      storyTitle: 'Sixty years of textile experience',
      story: [
        'Active in the textile industry since 1966, our company produces carpets in Gaziantep as a home textile manufacturer for end users.',
        'We use the latest technology and the finest materials, and bring our products in original colours and patterns to customers through an effective distribution network.',
        'Our in-house design team creates unique patterns that we weave into carpets with modern techniques, offering products for every taste.',
      ],
      pillarsEyebrow: 'Our principles',
      pillarsTitle: 'The values that define us',
      valuesEyebrow: 'Our strengths',
      valuesTitle: 'Why Karar Halı',
      fairsEyebrow: 'Trade fairs',
      fairsTitle: 'Where the industry meets',
      fairsText:
        'We present our new collections to business partners at trade fairs in Türkiye and abroad.',
      fairImages: [
        `${IMG}/project/galeri/fuar1.jpg`,
        `${IMG}/project/galeri/fuar2.jpg`,
        `${IMG}/project/galeri/fuar3.png`,
        `${IMG}/project/galeri/fuar4.jpg`,
      ],
    },
  },
  'collections.page': {
    tr: {
      eyebrow: 'Koleksiyonlar',
      title: 'Her mekâna bir Karar',
      titleAccent: 'bir Karar',
      description:
        'Halı ve rulo kesim olmak üzere iki ana gruptaki koleksiyonlarımızı inceleyin; her koleksiyonun modellerine ve renk seçeneklerine göz atın.',
    },
    en: {
      eyebrow: 'Collections',
      title: 'A Karar for every space',
      titleAccent: 'every space',
      description:
        'Browse our collections in two main groups, carpets and roll-cut, and explore the models and colour options of each.',
    },
  },
  'production.page': {
    tr: {
      eyebrow: 'Üretim',
      title: 'Tasarımdan sevkiyata, kontrollü üretim.',
      titleAccent: 'kontrollü',
      description:
        'Gaziantep 3. Organize Sanayi Bölgesi’ndeki tesisimizde, halılarımızın her aşamasını kendi ekiplerimizle yönetiyoruz.',
      image: `${IMG}/agency-1.jpg`,
      processEyebrow: 'Süreç',
      processTitle: 'Bir halının yolculuğu',
      processDescription:
        'Her ürün, bir sonraki aşamaya geçmeden önce ölçülebilir kalite kriterlerine göre kontrol edilir.',
      typesEyebrow: 'Ürün grupları',
      typesTitle: 'Halı ve rulo kesim',
      carpetsText: 'Standart ebatlarda (160 × 230, 200 × 290 cm) üretilen salon ve oda halıları.',
      carpetsImage: `${IMG}/project/koleksiyonlar.jpg`,
      rollsText: '80 cm’den 300 cm’ye kadar genişliklerde, istenen boyda kesilen rulo halılar.',
      rollsImage: `${IMG}/project/rulo.jpg`,
    },
    en: {
      eyebrow: 'Production',
      title: 'From design to shipping, a controlled process.',
      titleAccent: 'controlled',
      description:
        'At our facility in the Gaziantep 3rd Organized Industrial Zone, our own teams manage every stage of our carpets.',
      image: `${IMG}/agency-1.jpg`,
      processEyebrow: 'Process',
      processTitle: 'A carpet’s journey',
      processDescription:
        'Every product is checked against measurable quality criteria before moving on to the next stage.',
      typesEyebrow: 'Product groups',
      typesTitle: 'Carpets and roll-cut',
      carpetsText: 'Living room and bedroom carpets in standard sizes (160 × 230, 200 × 290 cm).',
      carpetsImage: `${IMG}/project/koleksiyonlar.jpg`,
      rollsText: 'Roll carpets in widths from 80 cm to 300 cm, cut to the length you need.',
      rollsImage: `${IMG}/project/rulo.jpg`,
    },
  },
  'contact.page': {
    tr: {
      eyebrow: 'İletişim',
      title: 'Bizimle iletişime geçin.',
      description: 'Size daha iyi hizmet verebilmemiz için formu doldurun ya da bizi arayın.',
    },
    en: {
      eyebrow: 'Contact',
      title: 'Get in touch.',
      description: 'Fill in the form or give us a call so we can serve you better.',
    },
  },
  cta: {
    tr: {
      title: 'Bayilik ve toptan satış için bizimle çalışın.',
      text: 'Koleksiyonlarımız, stok durumu ve bayilik koşulları hakkında bilgi almak için satış ekibimizle iletişime geçin.',
      button: 'Teklif isteyin',
    },
    en: {
      title: 'Partner with us for dealership and wholesale.',
      text: 'Contact our sales team for information on our collections, stock availability and dealership terms.',
      button: 'Request a quote',
    },
  },
}

// İletişim bilgileri kararhali.com'dan alınmıştır.
export const settingsSeed: Settings = {
  general: {
    siteName: 'Karar Halı',
    logo: `${IMG}/logo.png`,
    tagline: { tr: 'Kararsız kalmayın', en: 'Decide with confidence' },
    description: {
      tr: 'Karar Halı; 1966’dan bu yana Gaziantep’te özgün desenli halı ve rulo kesim halı koleksiyonları üreten köklü bir ev tekstili üreticisidir.',
      en: 'Karar Halı is an established home textile manufacturer producing original carpet and roll-cut carpet collections in Gaziantep since 1966.',
    },
    dealerLoginUrl: 'https://tahsilat.kararhali.com/',
  },
  contact: {
    phone: '+90 342 337 90 31',
    phoneLines: '+90 342 337 90 31-32-33',
    fax: '+90 342 337 90 34',
    email: 'karar@kararhali.com',
    address: {
      tr: '3. Organize Sanayi Bölgesi, 83302 Nolu Cadde No: 2, 27120 Başpınar / Gaziantep',
      en: '3rd Organized Industrial Zone, 83302 Street No: 2, 27120 Başpınar / Gaziantep, Türkiye',
    },
    hours: {
      tr: 'Pazartesi – Cumartesi, 08:30 – 18:00',
      en: 'Monday – Saturday, 08:30 – 18:00 (GMT+3)',
    },
  },
  social: {
    instagram: 'https://www.instagram.com/kararcarpet/',
    facebook: 'https://www.facebook.com/people/Karar-Halı/100003271087939/',
    linkedin: '',
    youtube: '',
  },
}
