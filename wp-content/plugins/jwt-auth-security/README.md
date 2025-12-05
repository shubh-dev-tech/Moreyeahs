# JWT Auth Security Plugin

A lightweight WordPress plugin that provides JWT (JSON Web Token) authentication with WordPress nonce protection for headless WordPress applications.

## Features

- 🔐 JWT token generation and validation
- 🛡️ WordPress nonce integration for CSRF protection
- 🔄 Token refresh functionality
- 🌐 CORS support
- ⚡ Lightweight with no external dependencies
- 🔒 Secure token signing with HMAC SHA-256

## Installation

1. The plugin is already installed in `wp-content/plugins/jwt-auth-security/`
2. Go to WordPress Admin → Plugins
3. Activate "JWT Auth Security"

## Configuration

Add these constants to your `wp-config.php`:

```php
// Required: Secret key for JWT signing
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-key-here');

// Required: Allowed origin for CORS
define('ALLOWED_ORIGIN', 'http://localhost:3000');
```

### Security Recommendations

1. **Secret Key**: Use a strong, random string (64+ characters)
2. **CORS**: Set specific origin URLs, avoid using '*' in production
3. **HTTPS**: Always use HTTPS in production
4. **Key Rotation**: Rotate your JWT secret key periodically

## API Endpoints

### Generate Token

**Endpoint**: `POST /wp-json/jwt-auth/v1/token`

**Request Body**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "nonce": "abc123def456",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "display_name": "Admin User",
    "roles": ["administrator"]
  },
  "expires_in": 3600
}
```

### Validate Token

**Endpoint**: `POST /wp-json/jwt-auth/v1/validate`

**Request Body**:
```json
{
  "token": "your_jwt_token"
}
```

**Response**:
```json
{
  "valid": true,
  "user_id": 1,
  "expires_at": 1234567890
}
```

### Refresh Token

**Endpoint**: `POST /wp-json/jwt-auth/v1/refresh`

**Request Body**:
```json
{
  "token": "your_current_token"
}
```

**Response**:
```json
{
  "success": true,
  "token": "new_jwt_token",
  "nonce": "new_nonce",
  "expires_in": 3600
}
```

### Get Nonce

**Endpoint**: `GET /wp-json/jwt-auth/v1/nonce`

**Response**:
```json
{
  "nonce": "abc123def456",
  "expires_in": 86400
}
```

## Usage with REST API

### Making Authenticated Requests

Include the JWT token in the Authorization header:

```bash
curl -X GET https://your-site.com/wp-json/wp/v2/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Write Operations (POST, PUT, DELETE)

Include both the JWT token and nonce:

```bash
curl -X POST https://your-site.com/wp-json/wp/v2/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Post content","status":"publish"}'
```

## Public Endpoints

The following endpoints are accessible without authentication (GET requests only):

- `/wp/v2/posts`
- `/wp/v2/pages`
- `/wp/v2/categories`
- `/wp/v2/tags`
- `/wp/v2/media`

All other endpoints and write operations require authentication.

## Token Expiration

- **Default Token Expiry**: 1 hour (3600 seconds)
- **Default Nonce Expiry**: 24 hours (86400 seconds)

To change token expiration, modify the plugin:

```php
private $token_expiry = 7200; // 2 hours
```

## Error Responses

### 400 Bad Request
```json
{
  "code": "missing_credentials",
  "message": "Username and password are required",
  "data": {
    "status": 400
  }
}
```

### 401 Unauthorized
```json
{
  "code": "invalid_credentials",
  "message": "Invalid username or password",
  "data": {
    "status": 401
  }
}
```

### 403 Forbidden
```json
{
  "code": "invalid_nonce",
  "message": "Invalid nonce",
  "data": {
    "status": 403
  }
}
```

## Customization

### Modify Token Payload

Edit the `create_token()` method to add custom claims:

```php
$payload = [
    'iss' => get_bloginfo('url'),
    'iat' => $issued_at,
    'exp' => $expiration,
    'user_id' => $user->ID,
    'username' => $user->user_login,
    'custom_claim' => 'custom_value' // Add your custom data
];
```

### Add Custom Validation

Modify the `validate_token()` method to add custom validation logic:

```php
public function validate_token($result, $server, $request) {
    // Your custom validation logic here
    
    return $result;
}
```

## Troubleshooting

### "Invalid token" errors
- Verify JWT_AUTH_SECRET_KEY is set correctly
- Check token hasn't expired
- Ensure token is properly formatted

### CORS errors
- Check ALLOWED_ORIGIN matches your frontend URL exactly
- Verify CORS headers are being sent
- Check for protocol mismatch (http vs https)

### Nonce validation fails
- Nonces expire after 24 hours
- Fetch a fresh nonce using the nonce endpoint
- Ensure X-WP-Nonce header is included

## Security Considerations

1. **Never expose your JWT_AUTH_SECRET_KEY**
2. **Use HTTPS in production**
3. **Implement rate limiting** for authentication endpoints
4. **Rotate secret keys** periodically
5. **Monitor failed authentication attempts**
6. **Use strong passwords** for WordPress users
7. **Keep WordPress and plugins updated**

## Compatibility

- WordPress 5.0+
- PHP 7.4+
- Works with any headless frontend (Next.js, React, Vue, etc.)

## License

This plugin is provided as-is for your project.

## Support

For issues or questions, refer to the main documentation in the Next.js project:
- `SECURITY_SETUP.md` - Full documentation
- `SECURITY_QUICKSTART.md` - Quick start guide
