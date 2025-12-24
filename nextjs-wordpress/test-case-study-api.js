// Test WordPress REST API case study endpoint
const baseUrl = 'http://localhost/moreyeahs-new';

async function testAPI() {
  try {
    console.log('Fetching from:', `${baseUrl}/wp-json/wp/v2/case_study?per_page=1&_embed`);
    
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/case_study?per_page=1&_embed`);
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('\n=== RAW API RESPONSE ===');
    console.log(JSON.stringify(data[0], null, 2));
    
    console.log('\n=== TITLE FIELD ===');
    console.log('Type:', typeof data[0].title);
    console.log('Value:', data[0].title);
    
    console.log('\n=== EXCERPT FIELD ===');
    console.log('Type:', typeof data[0].excerpt);
    console.log('Value:', data[0].excerpt);
    
    console.log('\n=== CONTENT FIELD ===');
    console.log('Type:', typeof data[0].content);
    console.log('Has rendered?:', data[0].content?.rendered ? 'YES' : 'NO');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
