import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

/**
 * Save User API Route Handler
 * Creates a new chat session and sends email notification asynchronously
 * 
 * @route POST /api/chatbot/save-user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, contact_number, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate unique session ID
    const sessionId = uuidv4();
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
    });

    // Send email notification asynchronously (don't wait for it)
    sendEmailNotification({ name, email, contact_number, message, sessionId, timestamp }).catch(err => {
      console.error('Email notification failed:', err);
    });

    // Try to register session with AI backend with timeout
    const API_ENDPOINT = process.env.CHATBOT_API_URL;
    
    if (API_ENDPOINT) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_ENDPOINT}/save-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
          },
          body: JSON.stringify({
            name,
            email,
            contact_number: contact_number || '',
            message: message || '',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            session_id: data.session_id || sessionId,
            success: true,
            email_sent: true,
          });
        }
      } catch (apiError: any) {
        if (apiError.name !== 'AbortError') {
          console.error('AI API Error:', apiError);
        }
      }
    }

    // Fallback: Return locally generated session ID
    return NextResponse.json({
      session_id: sessionId,
      success: true,
      email_sent: true,
    });
  } catch (error) {
    console.error('Error in save-user endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Reusable transporter instance (connection pooling)
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && process.env.MICROSOFT365_EMAIL && process.env.MICROSOFT365_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      pool: true, // Enable connection pooling
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: process.env.MICROSOFT365_EMAIL,
        pass: process.env.MICROSOFT365_PASSWORD,
      },
    });
  }
  return transporter;
}

/**
 * Send email notification for new chat session (async, non-blocking)
 */
async function sendEmailNotification(data: {
  name: string;
  email: string;
  contact_number?: string;
  message?: string;
  sessionId: string;
  timestamp: string;
}) {
  try {
    const emailTransporter = getTransporter();
    
    if (!emailTransporter) {
      return; // Skip silently if not configured
    }

    // Build email HTML content
    const emailContent = buildEmailTemplate(data);

    // Send email
    await emailTransporter.sendMail({
      from: process.env.MICROSOFT365_EMAIL,
      to: process.env.MICROSOFT365_EMAIL,
      cc: process.env.MICROSOFT365_CC,
      bcc: process.env.MICROSOFT365_BCC,
      replyTo: data.email,
      subject: `Chatbot Conversation: ${data.name}`,
      html: emailContent,
    });

  } catch (error) {
    // Silent fail - don't block user experience
    console.error('Email sending error:', error);
  }
}

/**
 * Build HTML email template (optimized)
 */
function buildEmailTemplate(data: {
  name: string;
  email: string;
  contact_number?: string;
  message?: string;
  sessionId: string;
  timestamp: string;
}): string {
  const phoneSection = data.contact_number ? `
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
      <p style="margin: 0 0 10px 0;"><strong style="color: #555;">Phone:</strong></p>
      <p style="margin: 0; font-size: 16px;">
        <a href="tel:${data.contact_number}" style="color: #e63946; text-decoration: none;">${data.contact_number}</a>
      </p>
    </div>` : '';

  const messageSection = data.message ? `
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
      <p style="margin: 0 0 10px 0;"><strong style="color: #555;">Initial Message:</strong></p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
        ${data.message.replace(/\n/g, '<br>')}
      </div>
    </div>` : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #e63946 0%, #d62828 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; color: #1a1a1a">🤖 New Chatbot Conversation</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; color: #1a1a1a">A new user has started a conversation via the AI Chatbot</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #555;">Name:</strong></p>
          <p style="margin: 0; font-size: 16px; color: #1a1a1a;">${data.name}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #555;">Email:</strong></p>
          <p style="margin: 0; font-size: 16px;">
            <a href="mailto:${data.email}" style="color: #e63946; text-decoration: none;">${data.email}</a>
          </p>
        </div>
        
        ${phoneSection}
        ${messageSection}
        
        <div style="background: white; padding: 20px; border-radius: 8px; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;"><strong>Session ID:</strong> ${data.sessionId}</p>
          <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${data.timestamp}</p>
          <p style="margin: 5px 0;"><strong>Source:</strong> AI Chatbot Widget</p>
        </div>
      </div>
      
      <p style="color: #666; margin-top: 20px; text-align: center;">
        Reply to: <a href="mailto:${data.email}" style="color: #e63946;">${data.email}</a>
      </p>
    </div>
  `;
}