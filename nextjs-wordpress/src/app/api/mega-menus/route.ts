import { NextResponse } from 'next/server';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/wp-json';

export async function GET() {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/mega-menus`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
