/**
 * ════════════════════════════════════════════════════════════════
 *  ESTEPINK — İŞLETME BİLGİLERİ
 *  Aşağıdaki örnek (sahte) bilgileri kendi bilgilerinizle değiştirin.
 *  Not: Form mesajlarının gideceği adres backend/.env → MAIL_TO
 * ════════════════════════════════════════════════════════════════
 */

export const CONTACT = {
  /** Sitede gösterilen e-posta adresi */
  email: 'info@estepink-ornek.com',
  /** Ekranda görünen telefon */
  phoneDisplay: '0531 481 25 26',
  /** tel: linki için, sadece rakam ve + */
  phoneHref: '+905314812526',
  address: {
    line1: 'İsmetpaşa, 49. Sk. No:1',
    line2: '34270 Sultangazi / İstanbul',
  },
  /** Google Maps'te aranacak metin (adres veya işletme adı) */
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
  const cleanNumber = CONTACT.phoneHref.replace(/\D/g, '');
  const text = encodeURIComponent(`Merhaba, ${serviceTitle} hakkında detaylı bilgi ve randevu almak istiyorum.`);
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  duration: string;
  points: readonly string[];
}

export const SERVICES: readonly Service[] = [
  {
    id: 'lazer-epilasyon',
    title: 'Lazer Epilasyon',
    summary: 'Buz başlıklı diyot lazer ile tüm cilt tiplerine uygun, konforlu ve kalıcı çözüm.',
    duration: '15 – 60 dk',
    points: ['Tüm vücut ve bölgesel paketler', 'Ön görüşme ve cilt analizi', 'Seans takibi ve kişisel plan'],
  },
  {
    id: 'cilt-bakimi',
    title: 'Medikal Cilt Bakımı',
    summary: 'Cildinizin ihtiyacına göre derin temizlik, nem ve ışıltı odaklı profesyonel bakım.',
    duration: '60 dk',
    points: ['Derin gözenek temizliği', 'Peeling ve maske uygulaması', 'Ev bakım rutini önerisi'],
  },
  {
    id: 'hydrafacial',
    title: 'Hydrafacial',
    summary: 'Temizleme, arındırma ve yoğun nem desteğini tek seansta birleştiren bakım.',
    duration: '45 dk',
    points: ['Vakum destekli arındırma', 'Antioksidan serum infüzyonu', 'Anında görünür ışıltı'],
  },
  {
    id: 'leke-akne',
    title: 'Leke & Akne Bakımı',
    summary: 'Ton eşitsizliği, akne ve izlerine yönelik kademeli, kişiye özel protokoller.',
    duration: '45 – 60 dk',
    points: ['Cilt tipine özel protokol', 'Kimyasal peeling seçenekleri', 'Düzenli ilerleme kontrolü'],
  },
  {
    id: 'bolgesel-incelme',
    title: 'Bölgesel İncelme',
    summary: 'Sıkılaşma ve vücut şekillendirme için cihaz destekli, ağrısız uygulamalar.',
    duration: '40 dk',
    points: ['Selülit görünümünde azalma', 'Sıkılaştırıcı radyofrekans', 'Kür planlaması'],
  },
  {
    id: 'kirpik-kas',
    title: 'Kirpik & Kaş Tasarımı',
    summary: 'Lifting, laminasyon ve şekillendirme ile doğal, bakımlı bir bakış.',
    duration: '30 – 60 dk',
    points: ['Kirpik lifting', 'Kaş laminasyonu', 'Yüz hatlarına uygun tasarım'],
  },
];
