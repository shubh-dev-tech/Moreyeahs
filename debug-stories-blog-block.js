/**
 * Debug Script for Stories Blog Block
 * 
 * Add this to your browser console to debug the Stories Blog Block API calls
 */

// Function to test API endpoints
async function testStoriesBlogAPI() {
    const baseURL = window.location.origin;
    
    console.log('🔍 Testing Stories Blog Block API Endpoints');
    console.log('Base URL:', baseURL);
    
    // Test 1: Regular Posts via WordPress REST API
    console.log('\n📝 Test 1: Regular Posts (WordPress REST API)');
    try {
        const response = await fetch(`${baseURL}/wp-json/wp/v2/posts?per_page=4&_embed=true`);
        const data = await response.json();
        console.log('✅ Success:', data.length, 'posts found');
        console.log('Sample post:', data[0]?.title?.rendered || 'No posts');
    } catch (error) {
        console.error('❌ Error:', error);
    }
    
    // Test 2: Case Studies via WordPress REST API
    console.log('\n📚 Test 2: Case Studies (WordPress REST API)');
    try {
        const response = await fetch(`${baseURL}/wp-json/wp/v2/case_study?per_page=4&_embed=true`);
        const data = await response.json();
        console.log('✅ Success:', data.length, 'case studies found');
        console.log('Sample case study:', data[0]?.title?.rendered || 'No case studies');
    } catch (error) {
        console.error('❌ Error:', error);
    }
    
    // Test 3: Posts via Custom Endpoint
    console.log('\n🔧 Test 3: Posts (Custom Endpoint)');
    try {
        const response = await fetch(`${baseURL}/wp-json/wp/v2/posts-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_type: 'post',
                per_page: 4
            })
        });
        const data = await response.json();
        console.log('✅ Success:', data.length, 'posts found');
        console.log('Sample post:', data[0]?.title?.rendered || 'No posts');
    } catch (error) {
        console.error('❌ Error:', error);
    }
    
    // Test 4: Case Studies via Custom Endpoint
    console.log('\n🔧 Test 4: Case Studies (Custom Endpoint)');
    try {
        const response = await fetch(`${baseURL}/wp-json/wp/v2/posts-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_type: 'case_study',
                per_page: 4
            })
        });
        const data = await response.json();
        console.log('✅ Success:', data.length, 'case studies found');
        console.log('Sample case study:', data[0]?.title?.rendered || 'No case studies');
    } catch (error) {
        console.error('❌ Error:', error);
    }
    
    // Test 5: Check Stories Blog Block Data
    console.log('\n🎯 Test 5: Stories Blog Block Data');
    const blockElement = document.querySelector('.stories-blog-block-data');
    if (blockElement) {
        console.log('✅ Block element found');
        console.log('Post Type:', blockElement.getAttribute('data-post-type'));
        console.log('Category:', blockElement.getAttribute('data-category'));
        console.log('Heading:', blockElement.getAttribute('data-heading'));
    } else {
        console.log('❌ Block element not found');
    }
    
    console.log('\n✨ Testing complete!');
}

// Function to monitor Stories Blog Block
function monitorStoriesBlogBlock() {
    console.log('👀 Monitoring Stories Blog Block...');
    
    // Override console.log to catch our component logs
    const originalLog = console.log;
    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string') {
            if (args[0].includes('Fetching posts from:') || 
                args[0].includes('POST data:') || 
                args[0].includes('Fetched posts:')) {
                originalLog('🎯 STORIES BLOG:', ...args);
                return;
            }
        }
        originalLog(...args);
    };
    
    // Override console.warn to catch warnings
    const originalWarn = console.warn;
    console.warn = function(...args) {
        if (args[0] && typeof args[0] === 'string') {
            if (args[0].includes('Case study endpoint failed') || 
                args[0].includes('Custom API failed')) {
                originalWarn('⚠️ STORIES BLOG:', ...args);
                return;
            }
        }
        originalWarn(...args);
    };
    
    // Override console.error to catch errors
    const originalError = console.error;
    console.error = function(...args) {
        if (args[0] && typeof args[0] === 'string') {
            if (args[0].includes('Error fetching posts') || 
                args[0].includes('All API attempts failed')) {
                originalError('🚨 STORIES BLOG:', ...args);
                return;
            }
        }
        originalError(...args);
    };
}

// Auto-run tests
console.log('🚀 Stories Blog Block Debug Script Loaded');
console.log('Run testStoriesBlogAPI() to test all endpoints');
console.log('Run monitorStoriesBlogBlock() to monitor component logs');

// Auto-start monitoring
monitorStoriesBlogBlock();