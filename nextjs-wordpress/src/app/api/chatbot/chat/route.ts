import { NextRequest, NextResponse } from 'next/server';

/**
 * Chat API Route Handler
 * Handles sending messages to the AI chatbot backend with optimizations
 * 
 * @route POST /api/chatbot/chat
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, session_id, name, email } = body;

    // Validate required fields
    if (!message || !session_id) {
      return NextResponse.json(
        { error: 'Message and session_id are required' },
        { status: 400 }
      );
    }

    // Get API endpoint from environment variables
    const API_ENDPOINT = process.env.CHATBOT_CHAT_API_URL || process.env.CHATBOT_API_URL;

    if (!API_ENDPOINT) {
      return NextResponse.json(
        { error: 'Chat API endpoint not configured' },
        { status: 500 }
      );
    }

    // Build request payload
    const payload: Record<string, string> = {
      message,
      session_id,
    };

    // Include user details for initial message
    if (name && email) {
      payload.name = name;
      payload.email = email;
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutMs = parseInt(process.env.CHATBOT_TIMEOUT || '60000'); // Default 60 seconds
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Forward request to AI backend with timeout and keep-alive
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        // @ts-ignore - Next.js specific
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Chat API error: ${response.status} - ${API_ENDPOINT}`);
        console.error('Error details:', errorData);
        return NextResponse.json(
          { error: 'Failed to get AI response', details: 'Backend service unavailable' },
          { status: response.status }
        );
      }

      const data = await response.json();

      return NextResponse.json({
        response: data.response || data.message,
        success: true,
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - please try again' },
          { status: 504 }
        );
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Something went wrong while connecting to AI service' },
      { status: 500 }
    );
  }
}