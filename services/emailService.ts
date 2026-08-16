import nodemailer from 'nodemailer';

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';

  const user = process.env.SMTP_USER || process.env.BREVO_SMTP_USER || process.env.BREVO_SENDER_EMAIL || '';
  const pass = process.env.SMTP_PASS || process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY || '';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@college.edu';
  const senderName = process.env.BREVO_SENDER_NAME || 'College Venue Management';
  const from = process.env.SMTP_FROM || `${senderName} <${senderEmail}>`;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc,
      bcc: options.bcc,
    });
    console.log(`[EmailService] Email sent successfully to ${options.to}`);
    return true;
  } catch (error: any) {
    console.error('Email send error:', error);
    if (error?.code === 'EAUTH' || error?.responseCode === 535) {
      console.error(
        '\n=======================================================\n' +
        '[EmailService ERROR] SMTP Authentication failed (535 EAUTH)\n' +
        '-------------------------------------------------------\n' +
        'Authentication failed with email server.\n' +
        'If using Brevo:\n' +
        '  - Set BREVO_SMTP_USER to your registered Brevo account login email.\n' +
        '  - Set BREVO_API_KEY / BREVO_SMTP_KEY to your valid Brevo SMTP key.\n' +
        '  - Set BREVO_SENDER_EMAIL to a verified sender email in Brevo.\n' +
        'If using custom SMTP / Gmail:\n' +
        '  - Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.\n' +
        '=======================================================\n'
      );
    }
    return false;
  }
}

// Email templates
export const emailTemplates = {
  verificationOTP: (fullName: string, otp: string, collegeName: string) => ({
    subject: 'Email Verification - Your OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB 0%, #14B8A6 100%); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Email Verification</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${fullName},</p>
          <p>Thank you for signing up at ${collegeName}. Please verify your email using the OTP below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #2563EB;">${otp}</p>
          </div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
        </div>
        <div style="padding: 20px; background: #f3f4f6; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p>${collegeName} - Venue Management System</p>
        </div>
      </div>
    `,
  }),

  welcome: (fullName: string, collegeName: string) => ({
    subject: `Welcome to ${collegeName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB 0%, #14B8A6 100%); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome!</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${fullName},</p>
          <p>Welcome to ${collegeName}'s Venue Management System. Your account has been successfully created.</p>
          <p>You can now:</p>
          <ul>
            <li>Request venues for your events</li>
            <li>Track your bookings</li>
            <li>View venue availability</li>
            <li>Receive notifications about your requests</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">For support, please contact the administration office.</p>
        </div>
        <div style="padding: 20px; background: #f3f4f6; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p>${collegeName} - Venue Management System</p>
        </div>
      </div>
    `,
  }),

  passwordResetOTP: (fullName: string, otp: string, collegeName: string) => ({
    subject: 'Password Reset - Your OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB 0%, #14B8A6 100%); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${fullName},</p>
          <p>We received a request to reset your password. Use the OTP below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #2563EB;">${otp}</p>
          </div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">If you didn't request this reset, please ignore this email.</p>
        </div>
        <div style="padding: 20px; background: #f3f4f6; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p>${collegeName} - Venue Management System</p>
        </div>
      </div>
    `,
  }),
};
