// Randevu Formu veri tipleri, doğrulama ve yardımcıları
import {
  buildWhatsAppUrl,
  buildAppointmentMessage,
  formatDateTR,
  formatPhoneNumber,
  getTodayDateString,
  isValidTurkishPhone,
  type AppointmentFormData,
  type AppointmentErrors,
  EMPTY_APPOINTMENT_FORM,
} from '../config/whatsapp';

export type { AppointmentFormData, AppointmentErrors };
export {
  buildWhatsAppUrl,
  buildAppointmentMessage,
  formatDateTR,
  formatPhoneNumber,
  getTodayDateString,
  isValidTurkishPhone,
  EMPTY_APPOINTMENT_FORM,
};

import { SERVICE_CATEGORIES } from '../content/serviceCategories';

export interface AppointmentServiceGroup {
  category: string;
  items: readonly string[];
}

// Hizmetler bölümüyle birebir aynı kategori ve hizmet listesi
export const APPOINTMENT_SERVICE_GROUPS: readonly AppointmentServiceGroup[] = SERVICE_CATEGORIES.map((cat) => ({
  category: cat.title,
  items: cat.items ? cat.items : (cat.groups?.flatMap((g) => g.items) ?? []),
}));

/**
 * Randevu formu alan kontrolü (zorunlu alanlar, telefon formatı, geçmiş tarih)
 */
export function validateAppointment(f: AppointmentFormData): AppointmentErrors {
  const errors: AppointmentErrors = {};

  // Ad Soyad kontrolü
  if (!f.fullName || f.fullName.trim().length === 0) {
    errors.fullName = 'Lütfen adınızı ve soyadınızı girin.';
  } else if (f.fullName.trim().length < 2) {
    errors.fullName = 'Ad ve soyad en az 2 karakter olmalıdır.';
  }

  // Telefon kontrolü (05XX XXX XX XX)
  const digits = f.phone.replace(/\D/g, '');
  if (!digits) {
    errors.phone = 'Lütfen telefon numaranızı girin.';
  } else if (!isValidTurkishPhone(f.phone)) {
    errors.phone = 'Geçerli bir telefon numarası girin (Örn: 05XX XXX XX XX).';
  }

  // Hizmet seçimi kontrolü
  if (!f.service || f.service.trim().length === 0) {
    errors.service = 'Lütfen bir hizmet seçin.';
  }

  // Tarih kontrolü (geçmiş tarih seçilemez)
  const today = getTodayDateString();
  if (!f.date || f.date.trim().length === 0) {
    errors.date = 'Lütfen randevu tarihi seçin.';
  } else if (f.date < today) {
    errors.date = 'Geçmiş bir tarih seçemezsiniz.';
  }

  // Saat kontrolü
  if (!f.time || f.time.trim().length === 0) {
    errors.time = 'Lütfen tercih edilen saati seçin.';
  }

  return errors;
}
