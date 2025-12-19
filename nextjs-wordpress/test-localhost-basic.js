/**
 * Test basic localhost WordPress accessibility
 */

async function testBasicAccess() {
  console.log('🚀 Testing Basic Localhost WordPress Access\n');

  const tests = [
    { name: 'WordPress Home', url: 'http://localhost/moreyeahs-new/' },
    { name: 'WordPress Admin', url: 'http://localhost/moreyeahs-new/wp-admin/' },
    { name: 'WordPress API Root', url: 'http://localhost/moreyeahs-new/wp-json/' },
  ];

  for (const test of tests) {
    try {
      console.log(`🧪 Testing ${test.name}...`);
      const response = await fetch(test.url);
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log(`   Content-Type: ${contentType}`);
        console.log(`   ✅ Accessible`);
      } else {
        console.log(`   ❌ Not accessible`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎉 Basic access testing completed!');
}

testBasicAccess().catch(console.error);