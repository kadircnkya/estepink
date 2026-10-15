const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Validates and normalises the contact payload.
 * Mirrors the client-side rules in frontend/src/lib/contact.ts.
 */
export function validateContact(body) {
  const data = {
    name: str(body.name, 80),
    phone: str(body.phone, 24),
    email: str(body.email, 120).toLowerCase(),
    service: str(body.service, 80),
    message: str(body.message, 2000),
  };

  const errors = {};
  if (data.name.length < 2) errors.name = 'Adınızı girin.';
  const digits = data.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) errors.phone = 'Geçerli bir telefon numarası girin.';
  if (!EMAIL_RE.test(data.email)) errors.email = 'Geçerli bir e-posta adresi girin.';
  if (data.message.length < 10) errors.message = 'Mesajınız en az 10 karakter olmalı.';
  if (body.consent !== true) errors.consent = 'KVKK onayı gereklidir.';

  return Object.keys(errors).length ? { data: null, errors } : { data, errors: null };
}
