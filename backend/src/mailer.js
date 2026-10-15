import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT = '465',
  SMTP_SECURE = 'true',
  SMTP_USER,
  SMTP_PASS,
  MAIL_TO = 'info@estepink-ornek.com',
  MAIL_FROM = 'Estepink Web Sitesi <no-reply@estepink-ornek.com>',
} = process.env;

/** Without SMTP credentials we run in dev mode: mails are logged, not sent. */
export const isDevMode = !SMTP_HOST || !SMTP_USER || !SMTP_PASS;

const transporter = isDevMode
  ? nodemailer.createTransport({ jsonTransport: true })
  : nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

export async function verifyTransport() {
  if (isDevMode) {
    console.log('ℹ SMTP ayarlanmadı → geliştirme modu (mailler terminale yazdırılır).');
    return;
  }
  try {
    await transporter.verify();
    console.log(`✔ SMTP bağlantısı hazır → mesajlar ${MAIL_TO} adresine gidecek.`);
  } catch (err) {
    console.error('✖ SMTP bağlantısı kurulamadı:', err.message);
  }
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function row(label, value) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1e4e8;color:#8a6476;font-size:12px;letter-spacing:.08em;text-transform:uppercase;width:130px;vertical-align:top">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1e4e8;color:#2b1020;font-size:15px">${value}</td>
    </tr>`;
}

/** @param {{name:string, phone:string, email:string, service:string, message:string}} data */
export async function sendContactMail(data) {
  const date = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

  const html = `
  <div style="background:#f7eef1;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">
    <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;padding:32px" width="100%">
      <tr><td>
        <p style="margin:0 0 4px;color:#d81b60;font-size:11px;letter-spacing:.2em;text-transform:uppercase">Estepink · Web Sitesi</p>
        <h1 style="margin:0 0 24px;color:#2b1020;font-family:Georgia,serif;font-weight:400;font-size:26px">Yeni iletişim talebi</h1>
        <table role="presentation" width="100%" style="border-collapse:collapse">
          ${row('Ad Soyad', esc(data.name))}
          ${row('Telefon', `<a href="tel:${esc(data.phone)}" style="color:#2b1020">${esc(data.phone)}</a>`)}
          ${row('E-posta', `<a href="mailto:${esc(data.email)}" style="color:#2b1020">${esc(data.email)}</a>`)}
          ${row('Hizmet', esc(data.service || 'Belirtilmedi'))}
          ${row('Tarih', esc(date))}
        </table>
        <p style="margin:24px 0 8px;color:#8a6476;font-size:12px;letter-spacing:.08em;text-transform:uppercase">Mesaj</p>
        <div style="color:#2b1020;font-size:15px;line-height:1.6;white-space:pre-wrap;background:#fbf6f7;border-radius:10px;padding:16px">${esc(data.message)}</div>
        <p style="margin:24px 0 0;color:#a88a97;font-size:12px">Bu e-postayı yanıtlayarak doğrudan müşteriye dönüş yapabilirsiniz.</p>
      </td></tr>
    </table>
  </div>`;

  const text = [
    'Yeni iletişim talebi — Estepink',
    '',
    `Ad Soyad: ${data.name}`,
    `Telefon : ${data.phone}`,
    `E-posta : ${data.email}`,
    `Hizmet  : ${data.service || 'Belirtilmedi'}`,
    `Tarih   : ${date}`,
    '',
    data.message,
  ].join('\n');

  const info = await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo: `"${data.name.replace(/"/g, '')}" <${data.email}>`,
    subject: `Yeni talep: ${data.name}${data.service ? ` · ${data.service}` : ''}`,
    text,
    html,
  });

  if (isDevMode) {
    console.log('\n──── [DEV] Gönderilecek e-posta ────');
    console.log(`Kime: ${MAIL_TO}`);
    console.log(text);
    console.log('────────────────────────────────────\n');
  }
  return info;
}
