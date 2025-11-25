import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const EMAIL_TO = process.env.EMAIL_TO;

export async function sendEmail(subject: string, html: string) {
  if (!RESEND_API_KEY || !EMAIL_TO) {
    console.log("Resend credentials missing. Logging email instead:");
    console.log(`To: ${EMAIL_TO}, Subject: ${subject}`);
    return;
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: subject,
      html: html,
    });
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
