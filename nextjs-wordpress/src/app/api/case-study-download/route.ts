import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface CaseStudyDownloadFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  caseStudyTitle: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CaseStudyDownloadFormData = await request.json();
    const { name, email, company, phone, caseStudyTitle } = body;

    // Validate required fields
    if (!name || !email || !caseStudyTitle) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and case study title are required' },
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
        <h2 style="color: #333;">New Case Study Download Request</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
          <p><strong>Case Study:</strong> ${caseStudyTitle}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        </div>
        <p style="color: #666; margin-top: 20px;">
          This user has downloaded the case study: <strong>${caseStudyTitle}</strong>
        </p>
        <p style="color: #666; margin-top: 10px;">
          Reply to: <a href="mailto:${email}">${email}</a>
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.MICROSOFT365_EMAIL,
      to: process.env.MICROSOFT365_EMAIL, // Send to same email
      cc:process.env.MICROSOFT365_CC,
      bcc:process.env.MICROSOFT365_BCC,
      replyTo: email,
      subject: `Case Study Download: ${caseStudyTitle} - ${name}`,
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully!'
    });

  } catch (error) {
    console.error('Case study download form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Case Study Download API is working',
    smtp: 'Microsoft 365'
  });
}

