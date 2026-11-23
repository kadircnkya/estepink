import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '../config/whatsapp';

// Estepink iletişim ve adres bilgileri
export const CONTACT = {
  email: 'estepink.01@gmail.com',
  phoneDisplay: '0555 991 95 88',
  phoneHref: `+${WHATSAPP_NUMBER}`,
  address: {
    line1: 'İsmetpaşa, 49. Sk. No:1',
    line2: '34270 Sultangazi / İstanbul',
  },
  mapsQuery: 'Estepink Estetik ve Güzellik, İsmetpaşa, 49. Sk. No:1, 34270 Sultangazi/İstanbul',
  hours: [
    { days: 'Pazartesi – Cumartesi', time: '10:00 – 20:00' },
    { days: 'Pazar', time: 'Kapalı' },
  ],
} as const;

export const MAPS = {
  embed: `https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapsQuery)}&z=15&output=embed`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACT.mapsQuery)}`,
} as const;

export function getServiceWhatsAppUrl(serviceTitle: string): string {
  return buildWhatsAppUrl(`Merhaba, ${serviceTitle} hakkında detaylı bilgi ve randevu almak istiyorum.`);
}
