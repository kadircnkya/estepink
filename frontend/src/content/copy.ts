import type { NavTarget } from '../lib/config';
import { buildWhatsAppUrl } from '../config/whatsapp';

export const LINKS = {
  whatsapp: buildWhatsAppUrl('Merhaba, randevu almak istiyorum.'),
  instagram: 'https://instagram.com/estepinksultangazi',
  instagramHandle: '@estepinksultangazi',
} as const;

export const BRAND = {
  name: 'Estepink',
  logoAlt: 'Estepink Logo',
} as const;

export const NAV: ReadonlyArray<{ target: NavTarget; label: string }> = [
  { target: 'hizmetler', label: 'Hizmetler' },
  { target: 'iletisim', label: 'İletişim' },
];

export const UI = {
  navLabel: 'Bölümler',
  homeLabel: 'Estepink ana sayfa',
  bookShort: 'Randevu al',
  loaderLabel: 'Yükleniyor',
  playVideo: 'Tanıtım videosunu izle',
  closeVideo: 'Kapat',
  videoDialog: 'Tanıtım videosu',
  videoUnsupported: 'Tarayıcınız bu videoyu oynatamıyor.',
} as const;

export const HERO_COPY = {
  title: 'Pürüzsüz cilt, *profesyonel deneyim.*',
  body: 'Estepink güzellik ve epilasyon merkezi. Şehrin kalbinde, kendinize ayırdığınız en huzurlu ve özenli anlar.',
  tags: ['Lazer Epilasyon', 'Cilt Bakımı', 'Hijyenik Odalar', 'İstanbul'],
  cta: 'Tanıtım videosunu izle',
  galleryCta: 'Defteri Keşfet',
} as const;

export const VIDEO_COPY = {
  title: 'Tanıtım videosu',
  body: "Estepink'i 35 saniyede yakından keşfedin. Konforlu bekleme alanımız ve son teknoloji cihazlarımız.",
} as const;
