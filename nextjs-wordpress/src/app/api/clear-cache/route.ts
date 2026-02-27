import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Revalidate all common paths
    const paths = [
      '/',
      '/posts',
      '/blog',
      '/case-study',
      '/careers',
      '/industries',
      '/services',
      '/about',
      '/contact',
    ];

    for (const path of paths) {
      revalidatePath(path);
      revalidatePath(path, 'layout');
      revalidatePath(path, 'page');
    }

    // Revalidate dynamic routes
    revalidatePath('/[slug]', 'page');
    revalidatePath('/posts/[slug]', 'page');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/case-study/[slug]', 'page');
    revalidatePath('/careers/[slug]', 'page');
    revalidatePath('/industries/[slug]', 'page');

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      paths_cleared: paths.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to clear cache',
    usage: 'POST /api/clear-cache',
  });
}
