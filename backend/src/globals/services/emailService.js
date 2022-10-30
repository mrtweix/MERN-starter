import nodemailer from 'nodemailer';
import config from '../../config/config.js';

const emailService = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: {
      user: config.SMTP_EMAIL,
      pass: config.SMTP_PASSWORD
    }
  });

  const message = {
    from: `${config.SMTP_USER} <${config.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  await transporter.sendMail(message);
};

export default emailService;
