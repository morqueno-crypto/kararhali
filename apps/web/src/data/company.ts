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
  values: Item[]
  milestones: { year: string; text: string }[]
  productionSteps: Item[]
  facilityHighlights: Stat[]
  certifications: string[]
}

// Örnek (dummy) kurumsal içerik.
export const companyContent: Localized<CompanyContent> = {
  tr: {
    stats: [
      { value: '1987', label: 'Kuruluş yılı' },
      { value: '45.000 m²', label: 'Kapalı üretim alanı' },
      { value: '3,5 milyon m²', label: 'Yıllık üretim kapasitesi' },
      { value: '40+', label: 'İhracat yapılan ülke' },
    ],
    values: [
      {
        title: 'Ustalık',
        text: 'Üç kuşaktır aktarılan dokuma bilgisini modern teknolojiyle birleştiriyoruz.',
      },
      {
        title: 'Sürdürülebilirlik',
        text: 'Geri dönüştürülmüş iplik, güneş enerjisi ve su geri kazanımıyla üretiyoruz.',
      },
      {
        title: 'Tasarım',
        text: 'Kendi tasarım stüdyomuzda her yıl 200’ü aşkın yeni desen geliştiriyoruz.',
      },
      {
        title: 'Güvenilirlik',
        text: 'Zamanında teslimat ve tutarlı kaliteyle uzun soluklu iş ortaklıkları kuruyoruz.',
      },
    ],
    milestones: [
      { year: '1987', text: 'Gaziantep’te 12 tezgâhlı küçük bir atölye olarak kuruldu.' },
      { year: '1998', text: 'İlk Wilton jakar tezgâhları devreye alındı, ihracat başladı.' },
      { year: '2008', text: 'Organize Sanayi Bölgesi’ndeki yeni tesise taşınıldı.' },
      { year: '2016', text: 'Tasarım stüdyosu ve dijital desen laboratuvarı kuruldu.' },
      { year: '2022', text: 'Çatı GES ile enerjinin %60’ı güneşten karşılanmaya başlandı.' },
      { year: '2026', text: '40’ı aşkın ülkede satış noktası ve proje ortaklığına ulaşıldı.' },
    ],
    productionSteps: [
      {
        title: 'İplik seçimi ve boyama',
        text: 'Yün, pamuk ve sentetik iplikler laboratuvarda test edilir; reçeteye göre kendi boyahanemizde renklendirilir.',
      },
      {
        title: 'Tasarım ve dijital desen',
        text: 'Tasarım stüdyosunda çizilen desenler dijital ortamda tezgâh programına dönüştürülür.',
      },
      {
        title: 'Dokuma',
        text: 'Wilton jakar, tufting ve el tezgâhlarında desen ilmek ilmek dokunur.',
      },
      {
        title: 'Yıkama ve bitiş',
        text: 'Halılar yıkanır, kurutulur, tıraşlanır ve kenar işlemleri tamamlanır.',
      },
      {
        title: 'Kalite kontrol',
        text: 'Her halı ölçü, renk, yoğunluk ve yüzey kontrolünden tek tek geçer.',
      },
      {
        title: 'Paketleme ve sevkiyat',
        text: 'Geri dönüştürülebilir ambalajla paketlenir, dünyanın her yerine güvenle gönderilir.',
      },
    ],
    facilityHighlights: [
      { value: '120', label: 'Dokuma tezgâhı' },
      { value: '%60', label: 'Güneş enerjisi payı' },
      { value: '%85', label: 'Su geri kazanımı' },
      { value: '450+', label: 'Çalışan' },
    ],
    certifications: [
      'ISO 9001 Kalite Yönetimi',
      'ISO 14001 Çevre Yönetimi',
      'OEKO-TEX Standard 100',
      'GRS Geri Dönüştürülmüş İçerik',
    ],
  },
  en: {
    stats: [
      { value: '1987', label: 'Founded' },
      { value: '45,000 m²', label: 'Covered production area' },
      { value: '3.5 million m²', label: 'Annual production capacity' },
      { value: '40+', label: 'Export countries' },
    ],
    values: [
      {
        title: 'Craftsmanship',
        text: 'We combine weaving know-how passed down through three generations with modern technology.',
      },
      {
        title: 'Sustainability',
        text: 'We produce with recycled yarn, solar energy and water recovery.',
      },
      {
        title: 'Design',
        text: 'Our in-house design studio develops more than 200 new patterns every year.',
      },
      {
        title: 'Reliability',
        text: 'We build long-term partnerships through on-time delivery and consistent quality.',
      },
    ],
    milestones: [
      { year: '1987', text: 'Founded in Gaziantep as a small workshop with 12 looms.' },
      { year: '1998', text: 'First Wilton jacquard looms commissioned; exports began.' },
      { year: '2008', text: 'Moved to a new facility in the Organized Industrial Zone.' },
      { year: '2016', text: 'Design studio and digital pattern lab established.' },
      { year: '2022', text: 'Rooftop solar began supplying 60% of our energy.' },
      { year: '2026', text: 'Reached points of sale and project partners in over 40 countries.' },
    ],
    productionSteps: [
      {
        title: 'Yarn selection and dyeing',
        text: 'Wool, cotton and synthetic yarns are lab-tested and coloured to recipe in our own dye house.',
      },
      {
        title: 'Design and digital patterning',
        text: 'Patterns drawn in our design studio are converted into loom programs digitally.',
      },
      {
        title: 'Weaving',
        text: 'Patterns are woven knot by knot on Wilton jacquard, tufting and hand looms.',
      },
      {
        title: 'Washing and finishing',
        text: 'Carpets are washed, dried, sheared and their edges finished.',
      },
      {
        title: 'Quality control',
        text: 'Every carpet is individually checked for size, colour, density and surface.',
      },
      {
        title: 'Packing and shipping',
        text: 'Packed in recyclable materials and shipped safely worldwide.',
      },
    ],
    facilityHighlights: [
      { value: '120', label: 'Looms' },
      { value: '60%', label: 'Solar energy share' },
      { value: '85%', label: 'Water recovery' },
      { value: '450+', label: 'Employees' },
    ],
    certifications: [
      'ISO 9001 Quality Management',
      'ISO 14001 Environmental Management',
      'OEKO-TEX Standard 100',
      'GRS Recycled Content',
    ],
  },
}
