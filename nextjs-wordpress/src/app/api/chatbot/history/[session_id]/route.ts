import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache with TTL
const historyCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache

export async function GET(
  request: NextRequest,
  { params }: { params: { session_id: string } }
) {
  try {
    const { session_id } = params;

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = historyCache.get(session_id);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const API_ENDPOINT =
      process.env.CHATBOT_HISTORY_API_URL || 
      `${process.env.CHATBOT_API_URL}/history`;

    if (!API_ENDPOINT) {
      return NextResponse.json(
        { error: 'History API endpoint not configured' },
        { status: 500 }
      );
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_ENDPOINT}/${session_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
        },
        signal: controller.signal,
        // @ts-ignore - Next.js specific
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`History API error: ${response.status} - ${API_ENDPOINT}/${session_id}`);
        console.error('Error details:', errorData);
        return NextResponse.json(
          { error: 'Failed to fetch history', details: 'Backend service unavailable' },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      const responseData = {
        messages: data.messages || [],
        success: true,
      };

      // Cache the response
      historyCache.set(session_id, {
        data: responseData,
        timestamp: Date.now(),
      });

      // Clean old cache entries (simple cleanup)
      if (historyCache.size > 100) {
        const oldestKey = historyCache.keys().next().value;
        if (oldestKey) {
          historyCache.delete(oldestKey);
        }
      }

      return NextResponse.json(responseData);

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
    console.error('Error in history endpoint:', error);

    return NextResponse.json(
      { error: 'Something went wrong while fetching history' },
      { status: 500 }
    );
  }
}
