import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { CONTACT, MAPS, SERVICES } from '../content/site';
import { LINKS } from '../content/copy';
import { useReveal } from '../hooks/useReveal';
import { EMPTY_FORM, submitContact, validate, type ContactErrors, type ContactForm } from '../lib/contact';

interface ContactProps {
  presetService?: { title: string; nonce: number } | null;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
const FIELD_ORDER: (keyof ContactForm)[] = ['name', 'phone', 'email', 'service', 'message', 'consent'];

export function Contact({ presetService }: ContactProps) {
  const ref = useReveal<HTMLElement>();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (presetService) setForm((f) => ({ ...f, service: presetService.title }));
  }, [presetService]);

  const set = <K extends keyof ContactForm>(key: K, value: ContactForm[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setSubmitted(true);
    const v = validate(form);
    setErrors(v);
    const firstInvalid = FIELD_ORDER.find((k) => v[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus('sending');
    setServerError('');
    const res = await submitContact(form);
    if (res.ok) {
      setStatus('success');
      setForm(EMPTY_FORM);
      setSubmitted(false);
      setErrors({});
    } else {
      setStatus('error');
      setServerError(res.error);
      if (res.fields) setErrors(res.fields);
    }
  };

  const fieldProps = (key: keyof ContactForm) => ({
    id: `${uid}-${key}`,
    name: key,
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-err` : undefined,
  });

  const err = (key: keyof ContactForm) =>
    errors[key] ? (
      <p id={`${uid}-${key}-err`} className="field-error">
        {errors[key]}
      </p>
    ) : null;

  return (
    <section
      id="iletisim"
      ref={ref}
      aria-labelledby={`${uid}-title`}
      className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-8 sm:py-24 md:py-32"
    >
      {/* Başlık */}
      <div className="hairline grid gap-4 border-b pb-8 md:grid-cols-12 md:items-end md:gap-8 md:pb-14">
        <div className="md:col-span-7">
          <span className="eyebrow reveal">İletişim & Randevu</span>
          <h2 id={`${uid}-title`} className="section-title reveal mt-6" style={delay(80)}>
            Randevunuzu <i>birlikte</i> planlayalım.
          </h2>
        </div>
        <p className="reveal text-[16px] leading-relaxed text-muted md:col-span-5" style={delay(160)}>
          Formu doldurun, ekibimiz en geç bir iş günü içinde size dönüş yapsın. Acil talepler için WhatsApp
          hattımızdan da ulaşabilirsiniz.
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:mt-14 lg:grid-cols-12 lg:gap-16">
        {/* İletişim bilgileri ve Harita */}
        <div className="flex flex-col gap-6 md:gap-10 lg:col-span-5">
          <dl className="m-0 grid gap-0">
            <InfoRow label="Adres" d={0}>
              {CONTACT.address.line1}
              <br />
              {CONTACT.address.line2}
            </InfoRow>
            <InfoRow label="Telefon" d={60}>
              <a href={`tel:${CONTACT.phoneHref}`} className="text-ink no-underline transition-colors hover:text-pink">
                {CONTACT.phoneDisplay}
              </a>
            </InfoRow>
            <InfoRow label="E-posta" d={120}>
              <a href={`mailto:${CONTACT.email}`} className="text-ink no-underline transition-colors hover:text-pink">
                {CONTACT.email}
              </a>
            </InfoRow>
            <InfoRow label="Saatler" d={180}>
              <span className="flex flex-col gap-1">
                {CONTACT.hours.map((h) => (
                  <span key={h.days} className="flex flex-wrap justify-between gap-x-6 gap-y-0.5">
                    <span>{h.days}</span>
                    <span className="text-muted">{h.time}</span>
                  </span>
                ))}
              </span>
            </InfoRow>
          </dl>

          {/* Harita */}
          <figure className="reveal relative m-0 overflow-hidden rounded-[24px] border hairline" style={delay(220)}>
            <div className="relative aspect-[16/10] w-full bg-[#2a1420] sm:aspect-[4/3]">
              <iframe
                title={`Estepink konumu — ${CONTACT.address.line2}`}
                src={MAPS.embed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                style={{ filter: 'invert(0.92) hue-rotate(180deg) saturate(0.55) contrast(0.92) brightness(0.95)' }}
                allowFullScreen
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#3a0f2a]/25" />
            </div>
            <figcaption className="flex items-center justify-between gap-4 bg-white/[0.03] px-5 py-4">
              <span className="text-[13px] text-muted">{CONTACT.address.line2}</span>
              <a
                href={MAPS.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-pink no-underline hover:underline"
              >
                Yol tarifi al
                <Arrow />
              </a>
            </figcaption>
          </figure>
        </div>

        {/* Randevu Formu */}
        <div className="reveal lg:col-span-7" style={delay(120)}>
          <div className="relative rounded-[22px] border hairline bg-white/[0.035] p-5 backdrop-blur-xl sm:rounded-[28px] sm:p-10">
            {status === 'success' ? (
              <div role="status" className="flex min-h-[320px] flex-col items-start justify-center sm:min-h-[460px]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-fill text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-8 font-serif text-[30px] leading-tight text-ink sm:text-[38px]">
                  Teşekkürler, <i className="text-pink">mesajınız</i> bize ulaştı.
                </h3>
                <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-muted">
                  Ekibimiz en kısa sürede sizinle iletişime geçecek. Dilerseniz WhatsApp üzerinden de yazabilirsiniz.
                </p>
                <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <button type="button" onClick={() => setStatus('idle')} className="btn-ghost cursor-pointer bg-transparent">
                    Yeni mesaj gönder
                  </button>
                  <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary no-underline">
                    WhatsApp'tan yaz
                  </a>
                </div>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-form-note`}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label htmlFor={`${uid}-name`} className="field-label">
                      Ad Soyad
                    </label>
                    <input
                      {...fieldProps('name')}
                      type="text"
                      autoComplete="name"
                      placeholder="Adınız ve soyadınız"
                      maxLength={80}
                      className="field"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                    />
                    {err('name')}
                  </div>

                  <div>
                    <label htmlFor={`${uid}-phone`} className="field-label">
                      Telefon
                    </label>
                    <input
                      {...fieldProps('phone')}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="05xx xxx xx xx"
                      maxLength={24}
                      className="field"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                    />
                    {err('phone')}
                  </div>

                  <div>
                    <label htmlFor={`${uid}-email`} className="field-label">
                      E-posta
                    </label>
                    <input
                      {...fieldProps('email')}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="ornek@mail.com"
                      maxLength={120}
                      className="field"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                    />
                    {err('email')}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${uid}-service`} className="field-label">
                      İlgilendiğiniz hizmet <span className="normal-case tracking-normal opacity-70">(opsiyonel)</span>
                    </label>
                    <select
                      {...fieldProps('service')}
                      className="field cursor-pointer"
                      value={form.service}
                      onChange={(e) => set('service', e.target.value)}
                    >
                      <option value="">Seçiniz</option>
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor={`${uid}-message`} className="field-label">
                        Mesajınız
                      </label>
                      <span className="text-[12px] tabular-nums text-muted" aria-hidden="true">
                        {form.message.length}/2000
                      </span>
                    </div>
                    <textarea
                      {...fieldProps('message')}
                      rows={4}
                      maxLength={2000}
                      placeholder="Size uygun gün ve saatleri, merak ettiklerinizi yazabilirsiniz."
                      className="field resize-y"
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                    />
                    {err('message')}
                  </div>

                  {/* Bot koruması */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={(e) => set('website', e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${uid}-consent`} className="flex cursor-pointer items-start gap-3">
                      <input
                        {...fieldProps('consent')}
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => set('consent', e.target.checked)}
                        className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#d81b60]"
                      />
                      <span className="text-[13.5px] leading-relaxed text-muted">
                        Kişisel verilerimin, talebime dönüş yapılması amacıyla KVKK kapsamında işlenmesini kabul
                        ediyorum.
                      </span>
                    </label>
                    {err('consent')}
                  </div>
                </div>

                <div className="hairline mt-6 flex flex-col-reverse gap-4 border-t pt-6 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-8">
                  <p id={`${uid}-form-note`} className="m-0 text-[13px] text-muted">
                    Bilgileriniz yalnızca size dönüş yapmak için kullanılır.
                  </p>
                  <button type="submit" disabled={status === 'sending'} className="btn-primary w-full cursor-pointer border-0 sm:w-auto">
                    {status === 'sending' ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                        Gönderiliyor…
                      </>
                    ) : (
                      <>
                        Mesajı gönder
                        <Arrow />
                      </>
                    )}
                  </button>
                </div>

                <div aria-live="polite" className="empty:hidden">
                  {status === 'error' && serverError && (
                    <p className="mt-5 rounded-xl border border-[#ff8fab]/30 bg-[#ff8fab]/[0.08] px-4 py-3 text-[14px] text-[#ffb3c6]">
                      {serverError}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, d, children }: { label: string; d: number; children: ReactNode }) {
  return (
    <div className="reveal hairline grid grid-cols-[84px_1fr] gap-4 border-b py-3.5 first:pt-0 sm:grid-cols-[96px_1fr] sm:gap-6 sm:py-5" style={delay(d)}>
      <dt className="pt-0.5 text-[12px] uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="m-0 text-[16px] leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
