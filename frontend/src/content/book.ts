export interface BookSpread {
  id: string;
  index: number;
  /** Image source in /public/images */
  image: string;
  alt: string;
  /** Focus position {x, y} for CSS object-position (e.g. 50% 50%) */
  focus: { x: number; y: number };
  tag: string;
  title: string;
  body: string;
  pageNumber: string;
  isBooking?: boolean;
}

export const BOOK_SPREADS: readonly BookSpread[] = [
  {
    id: 'salon',
    index: 1,
    image: '/images/g1.webp',
    alt: 'Estepink aydınlık resepsiyon ve bekleme alanı',
    focus: { x: 50, y: 50 },
    tag: '01 — Salon',
    title: 'Kapıdan girer girmez *sakin* bir karşılama.',
    body: 'Aydınlık resepsiyon, rahat koltuklar ve çiçeklerle dolu bekleme alanı.',
    pageNumber: '01 / 09',
  },
  {
    id: 'estepink',
    index: 2,
    image: '/images/g2.webp',
    alt: 'Estepink ışıklı logo tabelası',
    focus: { x: 50, y: 40 },
    tag: '02 — Estepink',
    title: "Estepink'e *hoş* geldiniz.",
    body: 'Işıklı tabelamızın altında sizi güler yüzle karşılıyoruz.',
    pageNumber: '02 / 09',
  },
  {
    id: 'bakim-urunleri',
    index: 3,
    image: '/images/g3.webp',
    alt: 'Işıklı raflarda sergilenen profesyonel cilt bakım ürünleri',
    focus: { x: 50, y: 50 },
    tag: '03 — Bakım ürünleri',
    title: 'Bakımınızın ürünleri *göz* önünde.',
    body: 'Uygulamalarda kullanılan ürünler, ışıklı raflarda düzenli biçimde sergileniyor.',
    pageNumber: '03 / 09',
  },
  {
    id: 'koridor',
    index: 4,
    image: '/images/g7.webp',
    alt: 'Ferah koridor ve yeşil dekoratif bitki',
    focus: { x: 45, y: 50 },
    tag: '04 — Koridor',
    title: 'Odalarınıza uzanan *aydınlık* bir yol.',
    body: 'Cam kapılar ve yumuşak ışıklarla ferah bir geçiş alanı.',
    pageNumber: '04 / 09',
  },
  {
    id: 'odalar',
    index: 5,
    image: '/images/g5.webp',
    alt: 'Temiz ve hijyenik özel uygulama odası',
    focus: { x: 50, y: 50 },
    tag: '05 — Odalar',
    title: 'Size ayrılmış, *hijyenik* uygulama odaları.',
    body: 'Her seansta temiz örtüler ve markalı havlularla hazırlanan odalar.',
    pageNumber: '05 / 09',
  },
  {
    id: 'detaylar',
    index: 6,
    image: '/images/g8.webp',
    alt: 'Pembe havlulu ve düzenli uygulama yatağı detayı',
    focus: { x: 50, y: 50 },
    tag: '06 — Detaylar',
    title: 'Küçük detaylar, *büyük* özen.',
    body: 'Pembe havlular ve sakin tonlarla rahatlatıcı bir ortam.',
    pageNumber: '06 / 09',
  },
  {
    id: 'cihazlar',
    index: 7,
    image: '/images/g4.webp',
    alt: 'Modern cilt bakım ve uygulama cihazları',
    focus: { x: 50, y: 50 },
    tag: '07 — Cihazlar',
    title: 'Cilt bakımı için *modern* cihazlar.',
    body: 'Uygulamanızı yapacak cihazları, randevudan önce görün.',
    pageNumber: '07 / 09',
  },
  {
    id: 'epilasyon',
    index: 8,
    image: '/images/g9.webp',
    alt: 'Epilasyon için hazır lazer cihazı ve steril ortam',
    focus: { x: 50, y: 50 },
    tag: '08 — Epilasyon',
    title: 'Epilasyon için hazır, *temiz* bir ortam.',
    body: 'Uygulama odalarımız her seans öncesinde yeniden hazırlanır.',
    pageNumber: '08 / 09',
  },
  {
    id: 'randevu',
    index: 9,
    image: '/images/g6.webp',
    alt: 'Işıklı cilt analiz ve uygulama panosu',
    focus: { x: 50, y: 50 },
    tag: '09 — Randevu',
    title: 'Randevunuzu *birlikte* planlayalım.',
    body: 'Hangi uygulama için geldiğinizi yazın, size uygun saati bulalım.',
    pageNumber: '09 / 09',
    isBooking: true,
  },
] as const;
