// İletişim formu veri tipi ve doğrulama
export interface ContactForm {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  consent: boolean;
  website: string; // bot koruması
}

export type ContactErrors = Partial<Record<keyof ContactForm, string>>;

export const EMPTY_FORM: ContactForm = {
  name: '',
  phone: '',
  email: '',
  service: '',
  message: '',
  consent: false,
  website: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Form alanları kontrolü
export function validate(f: ContactForm): ContactErrors {
  const e: ContactErrors = {};
  if (f.name.trim().length < 2) e.name = 'Adınızı girin.';
  const digits = f.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) e.phone = 'Geçerli bir telefon numarası girin.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Geçerli bir e-posta adresi girin.';
  if (!f.service.trim()) e.service = 'Lütfen bir hizmet seçin.';
  if (f.message.trim().length < 10) e.message = 'Mesajınız en az 10 karakter olmalı.';
  if (!f.consent) e.consent = 'Devam etmek için onay vermeniz gerekiyor.';
  return e;
}

const API_BASE: string = import.meta.env.VITE_API_URL ?? '';

export async function submitContact(
  f: ContactForm,
): Promise<{ ok: true } | { ok: false; error: string; fields?: ContactErrors }> {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
    const json = (await res.json().catch(() => null)) as
      | { ok: boolean; error?: string; fields?: ContactErrors }
      | null;
    if (res.ok && json?.ok) return { ok: true };
    return {
      ok: false,
      error: json?.error ?? 'Mesajınız iletilemedi. Lütfen tekrar deneyin.',
      fields: json?.fields,
    };
  } catch {
    return { ok: false, error: 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.' };
  }
}
