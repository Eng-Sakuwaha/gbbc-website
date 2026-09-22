import { useEffect, useState } from 'react';
import { FaWhatsapp, FaFacebookF, FaEnvelope } from 'react-icons/fa';
import api from '../services/api';

const WHATSAPP_NUMBER = '260969172928';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hello Grace Bible Baptist Church Kitwe, I would like to know more.'
)}`;

const FACEBOOK_LINK = 'https://www.facebook.com/share/1DkEgAXFJx/?mibextid=wwXIfr';
const CHURCH_EMAIL = 'gracebiblebaptistchurchkitwe@gmail.com';

const WEB3FORMS_ACCESS_KEY = 'e4c9aba3-acb0-43cc-b818-c6f7163e1906';

export default function Contact() {
  const [s, setS] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/church/settings').then((r) => setS(r.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus({
        type: 'error',
        text: 'Contact form is not configured yet. Please contact us on WhatsApp.'
      });
      return;
    }

    setSending(true);

    try {
      api.post('/contact', form).catch(() => {});

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New contact message: ${form.subject || form.name}`,
          from_name: 'GBBC Website',
          name: form.name,
          email: form.email,
          phone: form.phone || '(not provided)',
          message: form.message,
          replyto: form.email
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Web3Forms rejected the request');
      }

      setStatus({
        type: 'success',
        text: 'Your message has been sent. God bless you!'
      });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus({
        type: 'error',
        text: 'Unable to send message right now. Please try again or contact us on WhatsApp.'
      });
    } finally {
      setSending(false);
    }
  };

  const email = s?.email && s.email.includes('@') ? s.email : CHURCH_EMAIL;

  return (
    <div className="section container">
      <h1>Contact Us</h1>

      <div className="contact-grid">
        <div>
          <h2>Grace Bible Baptist Church Kitwe</h2>
          <p><strong>Location:</strong><br />{s?.address}</p>

          {s?.phone && <p><strong>Phone:</strong> {s.phone}</p>}

          <p>
            <strong>Email:</strong>{' '}
            <a className="contact-email" href={`mailto:${email}`}>
              <FaEnvelope aria-hidden="true" />
              <span>{email}</span>
            </a>
          </p>

          <p>
            <strong>WhatsApp:</strong>{' '}
            <a
              className="contact-whatsapp"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
              <span>+260 969 172 928</span>
            </a>
          </p>

          <p>
            <strong>Facebook:</strong>{' '}
            <a
              className="contact-facebook"
              href={FACEBOOK_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF aria-hidden="true" />
              <span>Grace Bible Baptist Church Kitwe</span>
            </a>
          </p>

          {s?.mapLocation?.embedUrl && (
            <>
              <iframe
                title="map"
                src={s.mapLocation.embedUrl}
                className="map"
                loading="lazy"
              />
              <a
                className="btn-secondary"
                style={{ marginTop: '.75rem', display: 'inline-block' }}
                href="https://www.google.com/maps/dir/?api=1&destination=Grace+Baptist+Church+Kitwe+Zambia"
                target="_blank"
                rel="noreferrer"
              >
                Get Directions
              </a>
            </>
          )}
        </div>

        <form className="contact-form" onSubmit={submit}>
          <input
            className="input"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="input"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <textarea
            className="input"
            name="message"
            rows="5"
            placeholder="Message"
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button className="btn-primary" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send Message'}
          </button>
          {status && <p className={status.type}>{status.text}</p>}
        </form>
      </div>
    </div>
  );
}