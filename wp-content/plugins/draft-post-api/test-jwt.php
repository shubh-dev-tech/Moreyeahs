<?php
/**
 * Simple JWT test script
 * Visit: https://dev.moreyeahs.com/wp-content/plugins/draft-post-api/test-jwt.php
 */

// Include WordPress
require_once('../../../wp-load.php');

// Define JWT secret if not already defined
if (!defined('JWT_SECRET_KEY')) {
    define('JWT_SECRET_KEY', 'your-super-secret-jwt-key-change-this-in-production');
}

// Simple JWT implementation for testing
class SimpleJWT {
    public static function encode($payload, $key) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $key, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    public static function decode($jwt, $key) {
        $parts = explode('.', $jwt);
        if (count($parts) != 3) {
            return false;
        }
        
        list($header, $payload, $signature) = $parts;
        
        // Verify signature
        $valid_signature = hash_hmac('sha256', $header . "." . $payload, $key, true);
        $valid_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($valid_signature));
        
        if (!hash_equals($signature, $valid_signature)) {
            return false;
        }
        
        // Decode payload with proper padding
        $payload_padded = str_pad(str_replace(['-', '_'], ['+', '/'], $payload), strlen($payload) % 4, '=', STR_PAD_RIGHT);
        return json_decode(base64_decode($payload_padded), true);
    }
}

// Test JWT
$test_payload = [
    'user_id' => 1,
    'exp' => time() + 3600,
    'iat' => time()
];

echo "<h2>JWT Test Results</h2>";
echo "<p><strong>JWT Secret Key:</strong> " . JWT_SECRET_KEY . "</p>";

$token = SimpleJWT::encode($test_payload, JWT_SECRET_KEY);
echo "<p><strong>Generated Token:</strong><br>" . $token . "</p>";

$decoded = SimpleJWT::decode($token, JWT_SECRET_KEY);
echo "<p><strong>Decoded Payload:</strong><br>";
var_dump($decoded);
echo "</p>";

echo "<p><strong>Current Time:</strong> " . time() . "</p>";
echo "<p><strong>Token Expiry:</strong> " . $decoded['exp'] . "</p>";
echo "<p><strong>Token Valid:</strong> " . ($decoded['exp'] > time() ? 'Yes' : 'No') . "</p>";

// Test with your actual token if provided
if (isset($_GET['token'])) {
    echo "<hr><h3>Testing Your Token</h3>";
    $your_token = $_GET['token'];
    echo "<p><strong>Your Token:</strong><br>" . htmlspecialchars($your_token) . "</p>";
    
    $your_decoded = SimpleJWT::decode($your_token, JWT_SECRET_KEY);
    echo "<p><strong>Your Decoded Payload:</strong><br>";
    var_dump($your_decoded);
    echo "</p>";
}
?>