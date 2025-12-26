<?php
/**
 * CORS Fix Test Script
 * 
 * This script tests if CORS headers are properly configured for your REST API
 */

// Load WordPress
require_once('wp-load.php');

echo "<h1>CORS Configuration Test</h1>";
echo "<div style='font-family: Arial, sans-serif; max-width: 800px; margin: 20px;'>";

// Test REST API endpoints
$test_endpoints = [
    '/wp-json/wp/v2/case_study' => 'Case Studies REST API',
    '/wp-json/wp/v2/posts' => 'Posts REST API',
    '/wp-json/wp/v2/pages' => 'Pages REST API'
];

echo "<h2>Testing REST API Endpoints</h2>";

foreach ($test_endpoints as $endpoint => $description) {
    $url = home_url($endpoint);
    echo "<h3>Testing: {$description}</h3>";
    echo "<p><strong>URL:</strong> <a href='{$url}' target='_blank'>{$url}</a></p>";
    
    // Test the endpoint
    $response = wp_remote_get($url, [
        'headers' => [
            'Origin' => 'http://localhost:3000'
        ]
    ]);
    
    if (is_wp_error($response)) {
        echo "<p style='color: red;'>❌ Error: " . $response->get_error_message() . "</p>";
        continue;
    }
    
    $headers = wp_remote_retrieve_headers($response);
    $status_code = wp_remote_retrieve_response_code($response);
    
    echo "<p><strong>Status Code:</strong> {$status_code}</p>";
    
    // Check CORS headers
    $cors_headers = [
        'access-control-allow-origin' => 'Access-Control-Allow-Origin',
        'access-control-allow-methods' => 'Access-Control-Allow-Methods',
        'access-control-allow-headers' => 'Access-Control-Allow-Headers',
        'access-control-allow-credentials' => 'Access-Control-Allow-Credentials'
    ];
    
    echo "<h4>CORS Headers:</h4>";
    $cors_ok = true;
    
    foreach ($cors_headers as $header_key => $header_name) {
        if (isset($headers[$header_key])) {
            echo "<p style='color: green;'>✅ {$header_name}: {$headers[$header_key]}</p>";
        } else {
            echo "<p style='color: red;'>❌ {$header_name}: Not present</p>";
            $cors_ok = false;
        }
    }
    
    if ($cors_ok) {
        echo "<p style='color: green; font-weight: bold;'>✅ CORS headers are properly configured!</p>";
    } else {
        echo "<p style='color: red; font-weight: bold;'>❌ CORS headers are missing or incomplete</p>";
    }
    
    echo "<hr>";
}

// Test with JavaScript fetch simulation
echo "<h2>JavaScript Fetch Test</h2>";
echo "<p>This simulates how your NextJS frontend will access the API:</p>";

?>
<script>
async function testCorsFromFrontend() {
    const testUrl = '<?php echo home_url('/wp-json/wp/v2/case_study'); ?>';
    const resultDiv = document.getElementById('fetch-result');
    
    try {
        resultDiv.innerHTML = '<p>Testing fetch from frontend...</p>';
        
        const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // credentials: 'include' // Uncomment if you need cookies
        });
        
        if (response.ok) {
            const data = await response.json();
            resultDiv.innerHTML = `
                <p style="color: green;">✅ <strong>Success!</strong> Fetch worked from frontend</p>
                <p><strong>Status:</strong> ${response.status}</p>
                <p><strong>Data received:</strong> ${data.length} case studies</p>
                <details>
                    <summary>Response Headers</summary>
                    <pre>${JSON.stringify([...response.headers.entries()], null, 2)}</pre>
                </details>
            `;
        } else {
            resultDiv.innerHTML = `
                <p style="color: red;">❌ <strong>Error:</strong> ${response.status} ${response.statusText}</p>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <p style="color: red;">❌ <strong>CORS Error:</strong> ${error.message}</p>
            <p>This indicates CORS is not properly configured.</p>
        `;
    }
}

// Run the test when page loads
document.addEventListener('DOMContentLoaded', testCorsFromFrontend);
</script>

<div id="fetch-result">
    <p>Loading JavaScript test...</p>
</div>

<button onclick="testCorsFromFrontend()" style="background: #0073aa; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; margin: 20px 0;">
    Test CORS Again
</button>

<?php

echo "<h2>NextJS Frontend Configuration</h2>";
echo "<div style='background: #f0f8ff; padding: 15px; border-left: 4px solid #0073aa; margin: 20px 0;'>";
echo "<h3>Update your NextJS .env.local file:</h3>";
echo "<pre>";
echo "NEXT_PUBLIC_WORDPRESS_API_URL=" . home_url('/wp-json/wp/v2') . "\n";
echo "WORDPRESS_API_URL=" . home_url('/wp-json/wp/v2') . "\n";
echo "</pre>";
echo "</div>";

echo "<div style='background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;'>";
echo "<h3>Example NextJS fetch code:</h3>";
echo "<pre>";
echo "// In your NextJS component
const fetchCaseStudies = async () => {
  try {
    const response = await fetch('" . home_url('/wp-json/wp/v2/case_study') . "', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const caseStudies = await response.json();
    return caseStudies;
  } catch (error) {
    console.error('Error fetching case studies:', error);
    throw error;
  }
};";
echo "</pre>";
echo "</div>";

echo "</div>";
?>