// Optional Nodemailer wrapper. Silent no-op when EMAIL_* is not configured.
import nodemailer from 'nodemailer';

export const sendContactNotification = async (msg) => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    return null; // Not configured — silently skip.
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  return transporter.sendMail({
    from: `"GBBC Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New contact message: ${msg.subject || '(no subject)'}`,
    text: [
      `From:  ${msg.name} <${msg.email}>`,
      `Phone: ${msg.phone || '-'}`,
      '',
      msg.message
    ].join('\n')
  });
};