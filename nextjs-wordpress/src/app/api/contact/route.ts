import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  email: string;
  phone?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { email, phone, message } = body;

    // Validate required fields
    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Microsoft 365 SMTP Configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MICROSOFT365_EMAIL,
        pass: process.env.MICROSOFT365_PASSWORD,
      },
    });

    // Check if credentials are configured
    if (!process.env.MICROSOFT365_EMAIL || !process.env.MICROSOFT365_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #666; margin-top: 20px;">
          Reply to: <a href="mailto:${email}">${email}</a>
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.MICROSOFT365_EMAIL,
      to: process.env.MICROSOFT365_EMAIL, // Send to same email
      replyTo: email,
      subject: `Contact Form: ${email}`,
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Contact API is working',
    smtp: 'Microsoft 365'
  });
}