import { useEffect, useRef, useState, type FormEvent } from 'react';
import { LINKS } from '../../content/copy';
import { CONTACT, MAPS, SERVICES } from '../../content/site';
import { EMPTY_FORM, submitContact, validate, type ContactErrors, type ContactForm } from '../../lib/contact';

interface MobileContactProps {
  presetService?: { title: string; nonce: number } | null;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const STEPS = ['Hizmet', 'Bilgiler', 'Mesaj'] as const;
const STEP_KEYS: (keyof ContactForm)[][] = [['service'], ['name', 'phone', 'email'], ['message', 'consent']];

// Mobil için tek ekrana sığdırılmış 3 adımlı randevu formu
export function MobileContact({ presetService }: MobileContactProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  // Hizmetlerden tıklandıysa doğrudan bilgileri doldurma adımına geç
  useEffect(() => {
    if (!presetService) return;
    setForm((f) => ({ ...f, service: presetService.title }));
    setErrors({});
    setStatus('idle');
    setStep(1);
  }, [presetService]);

  const set = <K extends keyof ContactForm>(key: K, value: ContactForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusField = (key: keyof ContactForm) =>
    formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();

  // Adım doğrulaması
  const checkStep = (s: number): boolean => {
    const v = validate(form);
    const bad = STEP_KEYS[s]!.filter((k) => v[k]);
    if (bad.length === 0) return true;
    setErrors((e) => {
      const next = { ...e };
      for (const k of bad) next[k] = v[k];
      return next;
    });
    if (s !== 0) focusField(bad[0]!);
    return false;
  };

  const next = () => {
    if (checkStep(step)) setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    if (status === 'sending') return;
    const v = validate(form);
    const firstBadStep = STEP_KEYS.findIndex((keys) => keys.some((k) => v[k]));
    if (firstBadStep !== -1) {
      setErrors(v);
      setStep(firstBadStep);
      return;
    }
    setStatus('sending');
    setServerError('');
    const res = await submitContact(form);
    if (res.ok) {
      setStatus('success');
      setForm(EMPTY_FORM);
      setErrors({});
      setStep(0);
    } else {
      setStatus('error');
      setServerError(res.error);
      if (res.fields) {
        setErrors(res.fields);
        const bs = STEP_KEYS.findIndex((keys) => keys.some((k) => res.fields?.[k]));
        if (bs !== -1) setStep(bs);
      }
    }
  };

  const err = (key: keyof ContactForm) =>
    errors[key] ? (
      <p id={`m-${key}-err`} className="field-error">
        {errors[key]}
      </p>
    ) : null;
  const fp = (key: keyof ContactForm) => ({
    id: `m-${key}`,
    name: key,
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `m-${key}-err` : undefined,
  });

  const serviceOptions = [...SERVICES.map((s) => s.title), 'Diğer'];

  return (
    <section
      id="iletisim"
      aria-label="Randevu"
      className="snap-section relative flex min-h-[100svh] flex-col justify-center px-4 pb-[calc(96px+env(safe-area-inset-bottom,0px))] pt-[84px]"
    >
      <span className="eyebrow">İletişim &amp; Randevu</span>
      <h2 className="section-title mt-3 !text-[30px]">
        Randevunuzu <i>birlikte</i> planlayalım.
      </h2>

      <div className="relative mt-5 rounded-[22px] border hairline bg-white/[0.045] p-4">
        {status === 'success' ? (
          <div role="status" className="flex flex-col items-start gap-3 py-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-pink-fill text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="m-0 font-serif text-[28px] font-normal leading-tight text-ink">
              Teşekkürler, <i className="text-pink">mesajınız</i> bize ulaştı.
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-muted">Ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
            <div className="mt-2 flex w-full flex-col gap-3">
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary no-underline">
                WhatsApp'tan yaz
              </a>
              <button type="button" onClick={() => setStatus('idle')} className="btn-ghost cursor-pointer bg-transparent">
                Yeni mesaj gönder
              </button>
            </div>
          </div>
        ) : (
          <form ref={formRef} noValidate onSubmit={onSubmit}>
            {/* Adımlar */}
            <ol className="m-0 mb-4 flex list-none gap-2 p-0" aria-label="Adımlar">
              {STEPS.map((label, i) => (
                <li key={label} className="flex-1" aria-current={i === step ? 'step' : undefined}>
                  <span
                    className={[
                      'block h-1 rounded-full transition-colors duration-300',
                      i <= step ? 'bg-pink' : 'bg-white/15',
                    ].join(' ')}
                  />
                  <span
                    className={[
                      'mt-1.5 block text-[11px] uppercase tracking-[0.14em]',
                      i === step ? 'text-ink' : 'text-muted',
                    ].join(' ')}
                  >
                    {i + 1}. {label}
                  </span>
                </li>
              ))}
            </ol>

            {/* 1. Adım: Hizmet seçimi */}
            {step === 0 && (
              <fieldset className="m-0 border-0 p-0">
                <legend className="field-label">İlgilendiğiniz hizmet</legend>
                <div className="grid grid-cols-2 gap-2">
                  {serviceOptions.map((title) => {
                    const on = form.service === title;
                    return (
                      <button
                        key={title}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          set('service', title);
                          setStep(1);
                        }}
                        className={[
                          'min-h-[48px] cursor-pointer rounded-xl border px-3 py-2 text-left font-sans text-[14px] leading-tight transition-colors active:scale-[0.97]',
                          on ? 'border-pink bg-pink-fill/90 text-white' : 'border-white/15 bg-white/[0.04] text-ink',
                        ].join(' ')}
                      >
                        {title}
                      </button>
                    );
                  })}
                </div>
                {err('service')}
              </fieldset>
            )}

            {/* 2. Adım: İletişim bilgileri */}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <div>
                  <label htmlFor="m-name" className="field-label">Ad Soyad</label>
                  <input
                    {...fp('name')}
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    placeholder="Adınız ve soyadınız"
                    maxLength={80}
                    className="field"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                  />
                  {err('name')}
                </div>
                <div>
                  <label htmlFor="m-phone" className="field-label">Telefon</label>
                  <input
                    {...fp('phone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    placeholder="05xx xxx xx xx"
                    maxLength={24}
                    className="field"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                  {err('phone')}
                </div>
                <div>
                  <label htmlFor="m-email" className="field-label">E-posta</label>
                  <input
                    {...fp('email')}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    placeholder="ornek@mail.com"
                    maxLength={120}
                    className="field"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                  {err('email')}
                </div>
              </div>
            )}

            {/* 3. Adım: Mesaj ve onay */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="m-message" className="field-label">Mesajınız</label>
                    <span className="text-[12px] tabular-nums text-muted" aria-hidden="true">{form.message.length}/2000</span>
                  </div>
                  <textarea
                    {...fp('message')}
                    rows={3}
                    maxLength={2000}
                    enterKeyHint="done"
                    placeholder="Size uygun gün ve saatleri yazabilirsiniz."
                    className="field resize-none"
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                  />
                  {err('message')}
                </div>
                <div>
                  <label htmlFor="m-consent" className="flex min-h-[44px] cursor-pointer items-start gap-3 py-1">
                    <input
                      {...fp('consent')}
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => set('consent', e.target.checked)}
                      className="mt-0.5 h-[22px] w-[22px] shrink-0 cursor-pointer accent-[#d81b60]"
                    />
                    <span className="text-[13px] leading-relaxed text-muted">
                      Kişisel verilerimin KVKK kapsamında, dönüş yapılması amacıyla işlenmesini kabul ediyorum.
                    </span>
                  </label>
                  {err('consent')}
                </div>
                {/* Bot koruması */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
                </div>
                {status === 'error' && serverError && (
                  <p role="alert" className="m-0 rounded-xl border border-[#ff8fab]/30 bg-[#ff8fab]/[0.08] px-3 py-2 text-[14px] text-[#ffb3c6]">
                    {serverError}
                  </p>
                )}
              </div>
            )}

            {/* Butonlar */}
            <div className="mt-4 flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="btn-ghost shrink-0 cursor-pointer bg-transparent"
                >
                  Geri
                </button>
              )}
              {step > 0 && (
                <button type="submit" disabled={status === 'sending'} className="btn-primary flex-1 cursor-pointer border-0">
                  {step < STEPS.length - 1 ? 'Devam' : status === 'sending' ? 'Gönderiliyor…' : 'Mesajı gönder'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Hızlı arama ve yol tarifi */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <a href={`tel:${CONTACT.phoneHref}`} className="btn-ghost justify-center no-underline">
          Ara
        </a>
        <a href={MAPS.directions} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-center no-underline">
          Yol tarifi
        </a>
      </div>
    </section>
  );
}
