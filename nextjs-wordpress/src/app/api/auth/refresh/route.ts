import { NextRequest, NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_REST_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('jwt_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    // Forward request to WordPress
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Token refresh failed' },
        { status: response.status }
      );
    }

    // Update cookies
    const res = NextResponse.json(data);
    
    res.cookies.set('jwt_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: data.expires_in,
      path: '/',
    });

    res.cookies.set('wp_nonce', data.nonce, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
