import { NextResponse } from 'next/server';
import { WORDPRESS_API_URL } from '@/lib/env';

export async function GET() {
  try {
    // Test WordPress connection
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?per_page=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      wordpress_url: WORDPRESS_API_URL,
      status: response.status,
      pages_found: Array.isArray(data) ? data.length : 0,
      sample_page: Array.isArray(data) && data.length > 0 ? {
        id: data[0].id,
        title: data[0].title?.rendered,
        slug: data[0].slug,
      } : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      wordpress_url: WORDPRESS_API_URL,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
