/**
 * Test script for Site Settings API
 * 
 * Run this to verify the WordPress REST API endpoint is working:
 * node test-appearance-api.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env file
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split(/\r?\n/).forEach(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) {
        return;
      }
      
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        value = value.replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    return {};
  }
}

const env = loadEnv();
const WORDPRESS_REST_API_URL = env.WORDPRESS_REST_API_URL;

if (!WORDPRESS_REST_API_URL) {
  console.error('❌ Error: WORDPRESS_REST_API_URL not found in .env file');
  console.log('');
  console.log('💡 Please add this to your .env file:');
  console.log('   WORDPRESS_REST_API_URL=http://localhost/moreyeahs-new/wp-json/wp/v2');
  process.exit(1);
}

const apiUrl = `${WORDPRESS_REST_API_URL}/site-settings`;

console.log('🔍 Testing Site Settings API...');
console.log('📍 URL:', apiUrl);
console.log('');

const protocol = apiUrl.startsWith('https') ? https : http;

protocol.get(apiUrl, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📊 Response Status:', res.statusCode);
    console.log('');

    if (res.statusCode === 200) {
      try {
        const settings = JSON.parse(data);
        
        console.log('✅ API is working!');
        console.log('');
        console.log('📋 Site Settings:');
        console.log('  Title:', settings.title || '(not set)');
        console.log('  Description:', settings.description || '(not set)');
        console.log('  URL:', settings.url || '(not set)');
        console.log('');
        console.log('🖼️  Logo:', settings.logo ? '✅ Set' : '❌ Not set');
        if (settings.logo) {
          console.log('    URL:', settings.logo.url);
          console.log('    Size:', `${settings.logo.width}x${settings.logo.height}`);
        }
        console.log('');
        console.log('🎯 Favicon:', settings.favicon ? '✅ Set' : '❌ Not set');
        if (settings.favicon) {
          console.log('    URL:', settings.favicon.url);
          console.log('    Sizes available:', Object.keys(settings.favicon.sizes).join(', '));
        }
        console.log('');
        console.log('💡 Next Steps:');
        if (!settings.logo) {
          console.log('  - Upload a logo in WordPress: Appearance → Customize → Site Identity');
        }
        if (!settings.favicon) {
          console.log('  - Upload a favicon in WordPress: Appearance → Customize → Site Identity → Site Icon');
        }
        if (settings.logo && settings.favicon) {
          console.log('  - All set! Your site is ready to go.');
        }
      } catch (error) {
        console.error('❌ Error parsing JSON response:', error.message);
        console.log('Raw response:', data);
      }
    } else {
      console.error('❌ API request failed');
      console.log('Response:', data);
    }
  });
}).on('error', (error) => {
  console.error('❌ Error connecting to API:', error.message);
  console.log('');
  console.log('💡 Troubleshooting:');
  console.log('  1. Check that WordPress is running');
  console.log('  2. Verify WORDPRESS_REST_API_URL in .env file');
  console.log('  3. Make sure the URL is accessible');
  console.log('  4. Check for CORS issues if on different domains');
});
