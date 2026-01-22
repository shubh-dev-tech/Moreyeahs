import { getWordPressApiUrl } from '@/lib/environment';

export default async function TestApiPage() {
  const apiUrl = getWordPressApiUrl();
  
  let testResults = {
    apiUrl,
    caseStudyTest: null as any,
    postsTest: null as any,
    error: null as any
  };
  
  try {
    // Test case study endpoint
    const caseStudyResponse = await fetch(`${apiUrl}/wp/v2/case_study?per_page=5`, {
      next: { revalidate: 0 }, // Don't cache for testing
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    testResults.caseStudyTest = {
      status: caseStudyResponse.status,
      statusText: caseStudyResponse.statusText,
      ok: caseStudyResponse.ok,
      url: caseStudyResponse.url
    };
    
    if (caseStudyResponse.ok) {
      const data = await caseStudyResponse.json();
      testResults.caseStudyTest.count = Array.isArray(data) ? data.length : 0;
    } else {
      testResults.caseStudyTest.error = await caseStudyResponse.text();
    }
    
    // Test posts endpoint as fallback
    const postsResponse = await fetch(`${apiUrl}/wp/v2/posts?per_page=5`, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    testResults.postsTest = {
      status: postsResponse.status,
      statusText: postsResponse.statusText,
      ok: postsResponse.ok,
      url: postsResponse.url
    };
    
    if (postsResponse.ok) {
      const data = await postsResponse.json();
      testResults.postsTest.count = Array.isArray(data) ? data.length : 0;
    } else {
      testResults.postsTest.error = await postsResponse.text();
    }
    
  } catch (error) {
    testResults.error = error instanceof Error ? error.message : String(error);
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>WordPress API Test</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', marginBottom: '20px' }}>
        <h2>Configuration</h2>
        <p><strong>API URL:</strong> {testResults.apiUrl}</p>
      </div>
      
      <div style={{ background: '#f0f8ff', padding: '20px', marginBottom: '20px' }}>
        <h2>Case Study Endpoint Test</h2>
        <p><strong>URL:</strong> {testResults.apiUrl}/wp/v2/case_study</p>
        <p><strong>Status:</strong> {testResults.caseStudyTest?.status} {testResults.caseStudyTest?.statusText}</p>
        <p><strong>Success:</strong> {testResults.caseStudyTest?.ok ? '✅ Yes' : '❌ No'}</p>
        {testResults.caseStudyTest?.count !== undefined && (
          <p><strong>Count:</strong> {testResults.caseStudyTest.count} case studies found</p>
        )}
        {testResults.caseStudyTest?.error && (
          <div style={{ background: '#ffebee', padding: '10px', marginTop: '10px' }}>
            <strong>Error:</strong> {testResults.caseStudyTest.error}
          </div>
        )}
      </div>
      
      <div style={{ background: '#f0fff0', padding: '20px', marginBottom: '20px' }}>
        <h2>Posts Endpoint Test (Fallback)</h2>
        <p><strong>URL:</strong> {testResults.apiUrl}/wp/v2/posts</p>
        <p><strong>Status:</strong> {testResults.postsTest?.status} {testResults.postsTest?.statusText}</p>
        <p><strong>Success:</strong> {testResults.postsTest?.ok ? '✅ Yes' : '❌ No'}</p>
        {testResults.postsTest?.count !== undefined && (
          <p><strong>Count:</strong> {testResults.postsTest.count} posts found</p>
        )}
        {testResults.postsTest?.error && (
          <div style={{ background: '#ffebee', padding: '10px', marginTop: '10px' }}>
            <strong>Error:</strong> {testResults.postsTest.error}
          </div>
        )}
      </div>
      
      {testResults.error && (
        <div style={{ background: '#ffebee', padding: '20px', marginBottom: '20px' }}>
          <h2>General Error</h2>
          <p>{testResults.error}</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h2>Next Steps</h2>
        <ul>
          <li>If case study endpoint works: Case studies should load properly</li>
          <li>If case study endpoint fails but posts work: Fallback mechanism will be used</li>
          <li>If both fail: Check WordPress server configuration</li>
        </ul>
        
        <p style={{ marginTop: '20px' }}>
          <a href="/case-study" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            Test Case Studies Page
          </a>
        </p>
      </div>
    </div>
  );
}