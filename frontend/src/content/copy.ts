import type { NavTarget } from '../lib/config';
import { CONTACT } from './site';

const WHATSAPP_NUMBER: string = CONTACT.phoneHref.replace(/\D/g, '');
const WHATSAPP_TEXT = encodeURIComponent('Merhaba, randevu almak istiyorum.');

export const LINKS = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`,
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
  title: 'Pürüzsüz cilt, *pembe* bir deneyim.',
  body: 'Estepink güzellik ve epilasyon merkezi. Şehrin kalbinde, kendinize ayırdığınız en huzurlu ve özenli anlar.',
  tags: ['Lazer Epilasyon', 'Cilt Bakımı', 'Hijyenik Odalar', 'İstanbul'],
  cta: 'Tanıtım videosunu izle',
  galleryCta: 'Defteri Keşfet',
} as const;

export const VIDEO_COPY = {
  title: 'Tanıtım videosu',
  body: "Estepink'i 35 saniyede yakından keşfedin. Konforlu bekleme alanımız ve son teknoloji cihazlarımız.",
} as const;
