import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  // Check for secret to confirm this is a valid request
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // Get the path to revalidate from the request body
    const body = await request.json();
    const path = body.path || '/';

    // Revalidate the specified path
    revalidatePath(path);
    
    // Also revalidate common paths
    revalidatePath('/');
    revalidatePath('/posts');

    return NextResponse.json({ 
      revalidated: true, 
      path,
      now: Date.now() 
    });
  } catch (err) {
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Use POST method to revalidate',
    usage: 'POST /api/revalidate?secret=YOUR_SECRET with body: { "path": "/posts/slug" }'
  }, { status: 405 });
}
