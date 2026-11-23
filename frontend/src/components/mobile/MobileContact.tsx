import { useEffect, useRef, useState, type FormEvent } from 'react';
import { WhatsAppIcon } from '../WhatsAppIcon';
import { CONTACT, MAPS } from '../../content/site';
import {
  APPOINTMENT_SERVICE_GROUPS,
  EMPTY_APPOINTMENT_FORM,
  buildAppointmentMessage,
  buildWhatsAppUrl,
  formatPhoneNumber,
  getTodayDateString,
  validateAppointment,
  type AppointmentErrors,
  type AppointmentFormData,
} from '../../lib/contact';

interface MobileContactProps {
  presetService?: { title: string; nonce: number } | null;
}

type Status = 'idle' | 'success';

const STEPS = ['Hizmet', 'Bilgiler', 'Tarih & Saat'] as const;
const STEP_KEYS: (keyof AppointmentFormData)[][] = [
  ['service'],
  ['fullName', 'phone'],
  ['date', 'time', 'note'],
];

export function MobileContact({ presetService }: MobileContactProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const openPicker = (el: HTMLInputElement | null) => {
    if (!el) return;
    el.focus();
    try {
      el.showPicker?.();
    } catch {
      /* tarayıcı desteklemiyorsa yerel davranışa devam et */
    }
  };
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [form, setForm] = useState<AppointmentFormData>(EMPTY_APPOINTMENT_FORM);
  const [errors, setErrors] = useState<AppointmentErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>('');

  // Hizmetlerden tıklandıysa ilgili kategoriyi aç
  useEffect(() => {
    if (!presetService) return;
    const matched = APPOINTMENT_SERVICE_GROUPS.find((g) => g.category === presetService.title);
    setSelectedCategory(matched ? matched.category : null);
    setForm((f) => ({ ...f, service: presetService.title }));
    setErrors({});
    setStatus('idle');
    setStep(0);
  }, [presetService]);

  const setField = <K extends keyof AppointmentFormData>(key: K, value: AppointmentFormData[K]) => {
    let finalValue = value;
    if (key === 'phone') {
      finalValue = formatPhoneNumber(value as string) as AppointmentFormData[K];
    }
    setForm((f) => ({ ...f, [key]: finalValue }));
    if (errors[key]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  const focusField = (key: keyof AppointmentFormData) => {
    formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
  };

  // Mevcut adımın doğrulaması
  const checkStep = (s: number): boolean => {
    const v = validateAppointment(form);
    const stepFields = STEP_KEYS[s] ?? [];
    const bad = stepFields.filter((k) => v[k]);
    if (bad.length === 0) return true;

    setErrors((e) => {
      const next = { ...e };
      for (const k of bad) {
        next[k] = v[k];
      }
      return next;
    });

    const firstBad = bad[0];
    if (s !== 0 && firstBad) {
      focusField(firstBad);
    }
    return false;
  };

  const next = () => {
    if (checkStep(step)) {
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    }
  };

  // Adım çubuğundan sayfalar arası serbest geçiş
  const goToStep = (targetStep: number) => {
    if (targetStep === step) return;
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }
    for (let s = step; s < targetStep; s++) {
      if (!checkStep(s)) return;
    }
    setStep(targetStep);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      return next();
    }

    const v = validateAppointment(form);
    const firstBadStep = STEP_KEYS.findIndex((keys) => keys.some((k) => v[k]));
    if (firstBadStep !== -1) {
      setErrors(v);
      setStep(firstBadStep);
      const badKey = STEP_KEYS[firstBadStep]?.find((k) => v[k]);
      if (badKey) focusField(badKey);
      return;
    }

    // Randevu mesajı ve URL oluştur
    const message = buildAppointmentMessage(form);
    const whatsappUrl = buildWhatsAppUrl(message);
    setLastWhatsAppUrl(whatsappUrl);

    // WhatsApp'ı aç
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Başarı durumu
    setStatus('success');
    setForm(EMPTY_APPOINTMENT_FORM);
    setSelectedCategory(null);
    setErrors({});
    setStep(0);
  };

  const err = (key: keyof AppointmentFormData) =>
    errors[key] ? (
      <p id={`m-${key}-err`} className="field-error" role="alert">
        {errors[key]}
      </p>
    ) : null;

  const fp = (key: keyof AppointmentFormData) => ({
    id: `m-${key}`,
    name: key,
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `m-${key}-err` : undefined,
  });

  const todayStr = getTodayDateString();

  return (
    <section
      id="iletisim"
      aria-label="Randevu"
      className="snap-section relative flex min-h-[100svh] flex-col justify-center px-4 pb-[calc(96px+env(safe-area-inset-bottom,0px))] pt-[84px]"
    >
      <span className="eyebrow">İletişim &amp; Randevu</span>
      <h2 className="section-title mt-3 !text-[30px]">
        Randevunuzu <i>WhatsApp</i> ile planlayın.
      </h2>

      <div className="relative mt-5 rounded-[22px] border hairline bg-white/[0.045] p-4">
        {status === 'success' ? (
          <div role="status" className="flex flex-col items-start gap-3 py-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)]">
              <WhatsAppIcon className="h-7 w-7" />
            </span>
            <h3 className="m-0 font-serif text-[26px] font-normal leading-tight text-ink">
              WhatsApp'a <i className="text-[#25D366]">yönlendiriliyorsunuz...</i>
            </h3>
            <p className="m-0 text-[14.5px] leading-relaxed text-muted">
              Randevu talebiniz hazırlandı. WhatsApp ekranında mesajı kontrol edip{' '}
              <strong className="text-ink font-semibold">Gönder</strong> butonuna basmanız yeterlidir.
            </p>
            <div className="mt-2 flex w-full flex-col gap-3">
              {lastWhatsAppUrl && (
                <a
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp uygulamasını veya Web'i açın"
                  className="btn-whatsapp w-full justify-center no-underline"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>WhatsApp'ı Aç</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="btn-ghost cursor-pointer justify-center bg-transparent"
              >
                Yeni Randevu Talebi
              </button>
            </div>
          </div>
        ) : (
          <form ref={formRef} noValidate onSubmit={onSubmit}>
            {/* Adım Göstergesi (sayfalar arası geçiş) */}
            <ol className="m-0 mb-4 flex list-none gap-2 p-0" aria-label="Adımlar">
              {STEPS.map((label, i) => (
                <li key={label} className="flex-1" aria-current={i === step ? 'step' : undefined}>
                  <button
                    type="button"
                    onClick={() => goToStep(i)}
                    className="w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                  >
                    <span
                      className={[
                        'block h-1 rounded-full transition-colors duration-300',
                        i <= step ? 'bg-pink' : 'bg-white/15',
                      ].join(' ')}
                    />
                    <span
                      className={[
                        'mt-1.5 block text-[11px] uppercase tracking-[0.14em]',
                        i === step ? 'text-ink font-medium' : 'text-muted',
                      ].join(' ')}
                    >
                      {i + 1}. {label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            {/* 1. Adım: Önce Kategori, Sonra Alt Detaylar */}
            {step === 0 && (
              <fieldset className="m-0 border-0 p-0">
                {!selectedCategory ? (
                  <>
                    <legend className="field-label">Önce kategori seçin</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {APPOINTMENT_SERVICE_GROUPS.map((group) => {
                        const isCatActive =
                          form.service === group.category || group.items.includes(form.service);
                        return (
                          <button
                            key={group.category}
                            type="button"
                            onClick={() => setSelectedCategory(group.category)}
                            className={[
                              'flex min-h-[50px] cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left font-sans text-[13.5px] leading-tight transition-colors active:scale-[0.97]',
                              isCatActive
                                ? 'border-pink bg-pink-fill/20 text-white font-medium'
                                : 'border-white/15 bg-white/[0.04] text-ink',
                            ].join(' ')}
                          >
                            <span>{group.category}</span>
                            <span aria-hidden="true" className="text-pink text-xs">›</span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        aria-pressed={form.service === 'Diğer'}
                        onClick={() => {
                          setField('service', 'Diğer');
                          setStep(1);
                        }}
                        className={[
                          'col-span-2 min-h-[46px] cursor-pointer rounded-xl border px-3 py-2 text-left font-sans text-[13.5px] leading-tight transition-colors active:scale-[0.97]',
                          form.service === 'Diğer'
                            ? 'border-pink bg-pink-fill/90 text-white font-medium'
                            : 'border-white/15 bg-white/[0.04] text-ink',
                        ].join(' ')}
                      >
                        Diğer
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[12px] text-ink transition-colors hover:border-pink"
                      >
                        <span aria-hidden="true">‹</span> Kategoriler
                      </button>
                      <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-pink">
                        {selectedCategory}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {APPOINTMENT_SERVICE_GROUPS.find((g) => g.category === selectedCategory)?.items.map(
                        (item) => {
                          const on = form.service === item;
                          return (
                            <button
                              key={item}
                              type="button"
                              aria-pressed={on}
                              onClick={() => {
                                setField('service', item);
                                setStep(1);
                              }}
                              className={[
                                'min-h-[46px] cursor-pointer rounded-xl border px-3.5 py-2.5 text-left font-sans text-[13.5px] leading-tight transition-colors active:scale-[0.97]',
                                on
                                  ? 'border-pink bg-pink-fill/90 text-white font-medium'
                                  : 'border-white/15 bg-white/[0.04] text-ink',
                              ].join(' ')}
                            >
                              {item}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </>
                )}
                {err('service')}
              </fieldset>
            )}

            {/* 2. Adım: Kişisel Bilgiler */}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <div>
                  <label htmlFor="m-fullName" className="field-label">
                    Ad Soyad <span className="text-pink">*</span>
                  </label>
                  <input
                    {...fp('fullName')}
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    placeholder="Adınız ve soyadınız"
                    maxLength={80}
                    className="field"
                    value={form.fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                  />
                  {err('fullName')}
                </div>

                <div>
                  <label htmlFor="m-phone" className="field-label">
                    Telefon <span className="text-pink">*</span>
                  </label>
                  <input
                    {...fp('phone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    placeholder="05XX XXX XX XX"
                    maxLength={17}
                    className="field"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                  />
                  {err('phone')}
                </div>
              </div>
            )}

            {/* 3. Adım: Tarih, Saat ve Not */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                <div>
                  <label htmlFor="m-date" className="field-label">
                    Tercih Edilen Tarih <span className="text-pink">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...fp('date')}
                      ref={dateRef}
                      type="date"
                      min={todayStr}
                      className="field cursor-pointer"
                      value={form.date}
                      onClick={(e) => openPicker(e.currentTarget)}
                      onChange={(e) => setField('date', e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label="Tarih seçiciyi aç"
                      onClick={() => openPicker(dateRef.current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-1 text-muted transition-colors hover:text-pink"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="3" />
                        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {err('date')}
                </div>

                <div>
                  <label htmlFor="m-time" className="field-label">
                    Tercih Edilen Saat <span className="text-pink">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...fp('time')}
                      ref={timeRef}
                      type="time"
                      className="field cursor-pointer"
                      value={form.time}
                      onClick={(e) => openPicker(e.currentTarget)}
                      onChange={(e) => setField('time', e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label="Saat seçiciyi aç"
                      onClick={() => openPicker(timeRef.current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-1 text-muted transition-colors hover:text-pink"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {err('time')}
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="m-note" className="field-label">
                      Not <span className="normal-case tracking-normal opacity-70">(opsiyonel)</span>
                    </label>
                    <span className="text-[12px] tabular-nums text-muted" aria-hidden="true">
                      {(form.note ?? '').length}/500
                    </span>
                  </div>
                  <textarea
                    {...fp('note')}
                    rows={2}
                    maxLength={500}
                    enterKeyHint="done"
                    placeholder="Eklemek istediğiniz notlar..."
                    className="field resize-none"
                    value={form.note ?? ''}
                    onChange={(e) => setField('note', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Adım Gezinme ve Gönder Butonları */}
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
              {step > 0 && step < STEPS.length - 1 && (
                <button type="submit" className="btn-primary flex-1 cursor-pointer border-0">
                  Devam
                </button>
              )}
              {step === STEPS.length - 1 && (
                <button
                  type="submit"
                  className="btn-whatsapp flex-1 cursor-pointer border-0"
                  aria-label="Randevu talebini WhatsApp ile gönderin"
                >
                  <WhatsAppIcon className="h-5 w-5 shrink-0" />
                  <span>WhatsApp ile Gönder</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Hızlı Arama ve Yol Tarifi */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <a
          href={`tel:${CONTACT.phoneHref}`}
          aria-label={`Bizi arayın: ${CONTACT.phoneDisplay}`}
          className="btn-ghost justify-center no-underline"
        >
          Ara
        </a>
        <a
          href={MAPS.directions}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google Haritalar'da yol tarifi alın"
          className="btn-ghost justify-center no-underline"
        >
          Yol tarifi
        </a>
      </div>
    </section>
  );
}
