import { Router } from 'express';
import { sendContactMail } from '../mailer.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { validateContact } from '../utils/validate.js';

export const contactRouter = Router();

contactRouter.post('/', rateLimit({ windowMs: 15 * 60_000, max: 5 }), async (req, res) => {
  const body = req.body ?? {};

  // Bot koruması
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return res.json({ ok: true });
  }

  const { data, errors } = validateContact(body);
  if (errors) {
    return res.status(422).json({ ok: false, error: 'Lütfen formdaki alanları kontrol edin.', fields: errors });
  }

  try {
    await sendContactMail(data);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[contact] mail gönderilemedi:', err);
    return res
      .status(502)
      .json({ ok: false, error: 'Mesajınız şu an iletilemedi. Lütfen daha sonra tekrar deneyin.' });
  }
});
