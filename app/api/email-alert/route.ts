import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, message } = body;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email required' }, { status: 400 });
    }

    // Configure Transporter with .env credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send Email
    const info = await transporter.sendMail({
      from: process.env.VASE_ALERT_FROM_EMAIL || process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: message,
      // html: `<p>${message.replace(/\n/g, '<br>')}</p>`, // Optional: HTML version
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return NextResponse.json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error("Email API/SMTP Error:", error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
