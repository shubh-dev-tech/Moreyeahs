import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear cookies
  response.cookies.delete('jwt_token');
  response.cookies.delete('wp_nonce');

  return response;
}
