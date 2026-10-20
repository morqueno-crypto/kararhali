// Örnek (dummy) kurumsal içerik.

export const companyStats = [
  { value: '1987', label: 'Kuruluş yılı' },
  { value: '45.000 m²', label: 'Kapalı üretim alanı' },
  { value: '3,5 milyon m²', label: 'Yıllık üretim kapasitesi' },
  { value: '40+', label: 'İhracat yapılan ülke' },
] as const

export const companyValues = [
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
] as const

export const companyMilestones = [
  { year: '1987', text: 'Gaziantep’te 12 tezgâhlı küçük bir atölye olarak kuruldu.' },
  { year: '1998', text: 'İlk Wilton jakar tezgâhları devreye alındı, ihracat başladı.' },
  { year: '2008', text: 'Organize Sanayi Bölgesi’ndeki yeni tesise taşınıldı.' },
  { year: '2016', text: 'Tasarım stüdyosu ve dijital desen laboratuvarı kuruldu.' },
  { year: '2022', text: 'Çatı GES ile enerjinin %60’ı güneşten karşılanmaya başlandı.' },
  { year: '2026', text: '40’ı aşkın ülkede satış noktası ve proje ortaklığına ulaşıldı.' },
] as const

export const productionSteps = [
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
] as const

export const facilityHighlights = [
  { value: '120', label: 'Dokuma tezgâhı' },
  { value: '%60', label: 'Güneş enerjisi payı' },
  { value: '%85', label: 'Su geri kazanımı' },
  { value: '450+', label: 'Çalışan' },
] as const

export const certifications = [
  'ISO 9001 Kalite Yönetimi',
  'ISO 14001 Çevre Yönetimi',
  'OEKO-TEX Standard 100',
  'GRS Geri Dönüştürülmüş İçerik',
] as const
