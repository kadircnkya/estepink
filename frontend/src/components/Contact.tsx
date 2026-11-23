import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { CONTACT, MAPS } from '../content/site';
import { useReveal } from '../hooks/useReveal';
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
} from '../lib/contact';

interface ContactProps {
  presetService?: { title: string; nonce: number } | null;
}

type Status = 'idle' | 'success';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
const FIELD_ORDER: (keyof AppointmentFormData)[] = ['fullName', 'phone', 'service', 'date', 'time', 'note'];

export function Contact({ presetService }: ContactProps) {
  const ref = useReveal<HTMLElement>();
  const uid = useId();
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

  const [form, setForm] = useState<AppointmentFormData>(EMPTY_APPOINTMENT_FORM);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [errors, setErrors] = useState<AppointmentErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>('');

  // Hizmetler bölümünden seçilen hizmet varsa kategori ve form alanını doldur
  useEffect(() => {
    if (presetService?.title) {
      const matchedCat = APPOINTMENT_SERVICE_GROUPS.find((g) => g.category === presetService.title);
      if (matchedCat) {
        setSelectedCategory(matchedCat.category);
      }
      setForm((f) => ({ ...f, service: presetService.title }));
    }
  }, [presetService]);

  const setField = <K extends keyof AppointmentFormData>(key: K, value: AppointmentFormData[K]) => {
    let finalValue = value;
    if (key === 'phone') {
      finalValue = formatPhoneNumber(value as string) as AppointmentFormData[K];
    }
    const next = { ...form, [key]: finalValue };
    setForm(next);
    if (submitted) {
      setErrors(validateAppointment(next));
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validateAppointment(form);
    setErrors(validationErrors);

    const firstInvalid = FIELD_ORDER.find((k) => validationErrors[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Profesyonel WhatsApp mesajını ve yönlendirme bağlantısını hazırla
    const message = buildAppointmentMessage(form);
    const whatsappUrl = buildWhatsAppUrl(message);
    setLastWhatsAppUrl(whatsappUrl);

    // WhatsApp'ı yeni sekmede aç
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Başarı durumu göster ve formu sıfırla
    setStatus('success');
    setForm(EMPTY_APPOINTMENT_FORM);
    setSelectedCategory('');
    setSubmitted(false);
    setErrors({});
  };

  const fieldProps = (key: keyof AppointmentFormData) => ({
    id: `${uid}-${key}`,
    name: key,
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-err` : undefined,
  });

  const err = (key: keyof AppointmentFormData) =>
    errors[key] ? (
      <p id={`${uid}-${key}-err`} className="field-error" role="alert">
        {errors[key]}
      </p>
    ) : null;

  const todayStr = getTodayDateString();

  return (
    <section
      id="iletisim"
      ref={ref}
      aria-labelledby={`${uid}-title`}
      className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-8 sm:py-24 md:py-32"
    >
      {/* Bölüm Başlığı */}
      <div className="hairline grid gap-4 border-b pb-8 md:grid-cols-12 md:items-end md:gap-8 md:pb-14">
        <div className="md:col-span-7">
          <span className="eyebrow reveal">İletişim &amp; Randevu</span>
          <h2 id={`${uid}-title`} className="section-title reveal mt-6" style={delay(80)}>
            Randevunuzu <i>WhatsApp</i> ile planlayın.
          </h2>
        </div>
        <p className="reveal text-[16px] leading-relaxed text-muted md:col-span-5" style={delay(160)}>
          Aşağıdaki formu doldurun, bilgileriniz düzenli bir randevu mesajına dönüştürülerek doğrudan WhatsApp
          hattımıza iletilecektir.
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:mt-14 lg:grid-cols-12 lg:gap-16">
        {/* Sol Kolon: İletişim Bilgileri ve Harita */}
        <div className="flex flex-col gap-6 md:gap-10 lg:col-span-5">
          <dl className="m-0 grid gap-0">
            <InfoRow label="Adres" d={0}>
              {CONTACT.address.line1}
              <br />
              {CONTACT.address.line2}
            </InfoRow>
            <InfoRow label="Telefon" d={60}>
              <a
                href={`tel:${CONTACT.phoneHref}`}
                aria-label={`Bizi arayın: ${CONTACT.phoneDisplay}`}
                className="text-ink no-underline transition-colors hover:text-pink"
              >
                {CONTACT.phoneDisplay}
              </a>
            </InfoRow>
            <InfoRow label="E-posta" d={120}>
              <a
                href={`mailto:${CONTACT.email}`}
                aria-label={`E-posta gönderin: ${CONTACT.email}`}
                className="text-ink no-underline transition-colors hover:text-pink"
              >
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

          {/* Konum Haritası */}
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
                aria-label="Google Haritalar'da yol tarifi alın"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-pink no-underline hover:underline"
              >
                Yol tarifi al
                <Arrow />
              </a>
            </figcaption>
          </figure>
        </div>

        {/* Sağ Kolon: Randevu Formu */}
        <div className="reveal lg:col-span-7" style={delay(120)}>
          <div className="relative rounded-[22px] border hairline bg-white/[0.035] p-5 backdrop-blur-xl sm:rounded-[28px] sm:p-10">
            {status === 'success' ? (
              <div role="status" className="flex min-h-[360px] flex-col items-start justify-center sm:min-h-[460px]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)]">
                  <WhatsAppIcon className="h-8 w-8" />
                </span>

                <h3 className="mt-8 font-serif text-[28px] leading-tight text-ink sm:text-[36px]">
                  WhatsApp'a <i className="text-[#25D366]">yönlendiriliyorsunuz...</i>
                </h3>
                <p className="mt-4 max-w-[46ch] text-[15px] sm:text-[16px] leading-relaxed text-muted">
                  Randevu talebiniz hazırlandı. Açılan WhatsApp penceresinde mesajınızı kontrol edip{' '}
                  <strong className="text-ink font-semibold">Gönder</strong> butonuna basarak randevunuzu
                  tamamlayabilirsiniz.
                </p>

                <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  {lastWhatsAppUrl && (
                    <a
                      href={lastWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp uygulamasını veya Web'i açın"
                      className="btn-whatsapp no-underline"
                    >
                      <WhatsAppIcon className="h-5 w-5 shrink-0" />
                      <span>WhatsApp'ı Aç</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="btn-ghost cursor-pointer bg-transparent"
                  >
                    Yeni Randevu Oluştur
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-form-note`}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  {/* Ad Soyad */}
                  <div>
                    <label htmlFor={`${uid}-fullName`} className="field-label">
                      Ad Soyad <span className="text-pink">*</span>
                    </label>
                    <input
                      {...fieldProps('fullName')}
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

                  {/* Telefon */}
                  <div>
                    <label htmlFor={`${uid}-phone`} className="field-label">
                      Telefon <span className="text-pink">*</span>
                    </label>
                    <input
                      {...fieldProps('phone')}
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

                  {/* Hizmet Kategorisi & Alt Hizmet */}
                  <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label htmlFor={`${uid}-category`} className="field-label">
                        Hizmet Kategorisi <span className="text-pink">*</span>
                      </label>
                      <select
                        id={`${uid}-category`}
                        className="field cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setSelectedCategory(cat);
                          setField('service', cat === 'Diğer' ? 'Diğer' : '');
                        }}
                      >
                        <option value="">Kategori seçin</option>
                        {APPOINTMENT_SERVICE_GROUPS.map((g) => (
                          <option key={g.category} value={g.category}>
                            {g.category}
                          </option>
                        ))}
                        <option value="Diğer">Diğer</option>
                      </select>
                      {!selectedCategory && err('service')}
                    </div>

                    <div>
                      <label htmlFor={`${uid}-service`} className="field-label">
                        Alt Hizmet / Uygulama <span className="text-pink">*</span>
                      </label>
                      <select
                        {...fieldProps('service')}
                        disabled={!selectedCategory || selectedCategory === 'Diğer'}
                        className="field cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        value={form.service}
                        onChange={(e) => setField('service', e.target.value)}
                      >
                        <option value="">
                          {!selectedCategory
                            ? 'Önce kategori seçin'
                            : selectedCategory === 'Diğer'
                              ? 'Diğer seçildi'
                              : 'Uygulama seçin'}
                        </option>
                        {selectedCategory && selectedCategory !== 'Diğer' && (
                          <>
                            <option value={selectedCategory}>{selectedCategory} (Genel)</option>
                            {APPOINTMENT_SERVICE_GROUPS.find((g) => g.category === selectedCategory)?.items.map(
                              (item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ),
                            )}
                          </>
                        )}
                      </select>
                      {selectedCategory && selectedCategory !== 'Diğer' && err('service')}
                    </div>
                  </div>

                  {/* Tercih Edilen Tarih */}
                  <div>
                    <label htmlFor={`${uid}-date`} className="field-label">
                      Tercih Edilen Tarih <span className="text-pink">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...fieldProps('date')}
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

                  {/* Tercih Edilen Saat */}
                  <div>
                    <label htmlFor={`${uid}-time`} className="field-label">
                      Tercih Edilen Saat <span className="text-pink">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...fieldProps('time')}
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

                  {/* Not (opsiyonel) */}
                  <div className="sm:col-span-2">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor={`${uid}-note`} className="field-label">
                        Not <span className="normal-case tracking-normal opacity-70">(opsiyonel)</span>
                      </label>
                      <span className="text-[12px] tabular-nums text-muted" aria-hidden="true">
                        {(form.note ?? '').length}/500
                      </span>
                    </div>
                    <textarea
                      {...fieldProps('note')}
                      rows={3}
                      maxLength={500}
                      placeholder="Belirtmek istediğiniz ek bir bilgi veya özel durum varsa yazabilirsiniz."
                      className="field resize-y"
                      value={form.note ?? ''}
                      onChange={(e) => setField('note', e.target.value)}
                    />
                  </div>
                </div>

                {/* Alt Kısım ve Gönder Butonu */}
                <div className="hairline mt-6 flex flex-col-reverse gap-4 border-t pt-6 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-8">
                  <p id={`${uid}-form-note`} className="m-0 text-[13px] text-muted">
                    Gönder'e bastığınızda randevu detayları WhatsApp mesajı olarak hazırlanır.
                  </p>
                  <button
                    type="submit"
                    className="btn-whatsapp w-full sm:w-auto"
                    aria-label="Randevu talebini WhatsApp ile gönderin"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0" />
                    <span>WhatsApp ile Gönder</span>
                  </button>
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
    <div
      className="reveal hairline grid grid-cols-[84px_1fr] gap-4 border-b py-3.5 first:pt-0 sm:grid-cols-[96px_1fr] sm:gap-6 sm:py-5"
      style={delay(d)}
    >
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

