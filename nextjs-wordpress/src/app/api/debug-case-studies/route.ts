import { NextRequest, NextResponse } from 'next/server';
import { getWordPressApiUrl } from '@/lib/environment';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = getWordPressApiUrl();
    
    // Test multiple endpoints to see which ones work
    const endpoints = [
      `${apiUrl}/wp/v2/case_study`,
      `${apiUrl}/wp/v2/posts?categories=case-study`,
      `${apiUrl}/wp/v2/posts`,
      `${apiUrl}/wp/v2/pages`
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // Add timeout
          signal: AbortSignal.timeout(10000)
        });
        
        const status = response.status;
        const statusText = response.statusText;
        
        let data = null;
        let error = null;
        
        if (response.ok) {
          try {
            data = await response.json();
            // Limit data size for debugging
            if (Array.isArray(data)) {
              data = data.slice(0, 3).map(item => ({
                id: item.id,
                title: item.title?.rendered || item.title,
                slug: item.slug,
                type: item.type
              }));
            }
          } catch (parseError) {
            error = `Failed to parse JSON: ${parseError}`;
          }
        } else {
          try {
            error = await response.text();
          } catch {
            error = `HTTP ${status}: ${statusText}`;
          }
        }
        
        results.push({
          endpoint,
          status,
          statusText,
          success: response.ok,
          data,
          error
        });
        
      } catch (fetchError) {
        results.push({
          endpoint,
          status: 0,
          statusText: 'Network Error',
          success: false,
          data: null,
          error: fetchError instanceof Error ? fetchError.message : String(fetchError)
        });
      }
    }
    
    return NextResponse.json({
      apiUrl,
      timestamp: new Date().toISOString(),
      results
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}