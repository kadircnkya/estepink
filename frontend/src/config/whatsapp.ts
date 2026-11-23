// WhatsApp Entegrasyon Yapılandırması ve Yardımcı Fonksiyonlar

// Telefon numarası: başında + ve boşluk olmadan, ülke kodlu (Türkiye için 90)
export const WHATSAPP_NUMBER = '905314812526';

// Varsayılan genel iletişim mesajı
export const DEFAULT_MESSAGE = 'Merhaba, bilgi almak istiyorum.';

/**
 * Verilen mesajı içeren standart WhatsApp yönlendirme bağlantısı üretir.
 * Mobilde WhatsApp uygulamasını, masaüstünde WhatsApp Web'i açar.
 */
export function buildWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Randevu formu veri yapısı
 */
export interface AppointmentFormData {
  fullName: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  note?: string; // Opsiyonel
}

export type AppointmentErrors = Partial<Record<keyof AppointmentFormData, string>>;

export const EMPTY_APPOINTMENT_FORM: AppointmentFormData = {
  fullName: '',
  phone: '',
  service: '',
  date: '',
  time: '',
  note: '',
};

/**
 * YYYY-MM-DD tarihini GG.AA.YYYY formatına dönüştürür.
 */
export function formatDateTR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.trim().split('-');
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const [year, month, day] = parts;
    return `${day}.${month}.${year}`;
  }
  return dateStr;
}

/**
 * Bugünün tarihini YYYY-MM-DD formatında döner (HTML min attribute için)
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Telefon numarasını kullanıcı yazarken 05XX XXX XX XX formatında gösterir
 */
export function formatPhoneNumber(val: string): string {
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';

  let normalized = digits;
  // Kullanıcı 5 ile başladıysa başına 0 ekle
  if (!normalized.startsWith('0') && normalized.length <= 10) {
    normalized = '0' + normalized;
  }
  normalized = normalized.slice(0, 11);

  const parts: string[] = [];
  if (normalized.length > 0) parts.push(normalized.slice(0, 4));
  if (normalized.length > 4) parts.push(normalized.slice(4, 7));
  if (normalized.length > 7) parts.push(normalized.slice(7, 9));
  if (normalized.length > 9) parts.push(normalized.slice(9, 11));

  return parts.join(' ');
}

/**
 * Telefon format kontrolü (05XX XXX XX XX veya 5XX XXX XX XX)
 */
export function isValidTurkishPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return /^0?5\d{9}$/.test(digits);
}

/**
 * Randevu formu doğrulama kuralları
 */
export function validateAppointmentForm(f: AppointmentFormData): AppointmentErrors {
  const errors: AppointmentErrors = {};

  // Ad Soyad kontrolü
  if (!f.fullName || f.fullName.trim().length === 0) {
    errors.fullName = 'Lütfen adınızı ve soyadınızı girin.';
  } else if (f.fullName.trim().length < 2) {
    errors.fullName = 'Ad soyad en az 2 karakter olmalıdır.';
  }

  // Telefon kontrolü
  const digits = f.phone.replace(/\D/g, '');
  if (!digits) {
    errors.phone = 'Lütfen telefon numaranızı girin.';
  } else if (!isValidTurkishPhone(f.phone)) {
    errors.phone = 'Geçerli bir telefon numarası girin (Örn: 05XX XXX XX XX).';
  }

  // Hizmet kontrolü
  if (!f.service || f.service.trim().length === 0) {
    errors.service = 'Lütfen bir hizmet seçin.';
  }

  // Tarih kontrolü
  const today = getTodayDateString();
  if (!f.date || f.date.trim().length === 0) {
    errors.date = 'Lütfen randevu tarihi seçin.';
  } else if (f.date < today) {
    errors.date = 'Geçmiş bir tarih seçemezsiniz.';
  }

  // Saat kontrolü
  if (!f.time || f.time.trim().length === 0) {
    errors.time = 'Lütfen randevu saati seçin.';
  }

  return errors;
}

/**
 * Kullanıcı girdilerini profesyonel randevu mesaj şablonuna dönüştürür
 */
export function buildAppointmentMessage(data: AppointmentFormData): string {
  const adSoyad = data.fullName.trim();
  const telefon = formatPhoneNumber(data.phone.trim()) || data.phone.trim();
  const hizmet = data.service.trim();
  const tarih = formatDateTR(data.date.trim());
  const saat = data.time.trim();
  const not = data.note && data.note.trim().length > 0 ? data.note.trim() : 'Belirtilmedi';

  return [
    '✨ *Randevu Talebi*',
    '',
    `👤 *Ad Soyad:* ${adSoyad}`,
    `📞 *Telefon:* ${telefon}`,
    `💆‍♀️ *Hizmet:* ${hizmet}`,
    `📅 *Tarih:* ${tarih}`,
    `🕐 *Saat:* ${saat}`,
    `📝 *Not:* ${not}`,
  ].join('\n');
}

