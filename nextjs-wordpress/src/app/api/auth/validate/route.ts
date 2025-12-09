import { NextRequest, NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_REST_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('jwt_token')?.value;

    if (!token) {
      return NextResponse.json({ valid: false, message: 'No token found' });
    }

    // Validate with WordPress
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ valid: false, message: 'Validation failed' });
  }
}
