# Secure Draft Post API

A secure WordPress plugin with JWT authentication for creating draft posts only. This API is restricted to only allow creating draft posts - no update, delete, or other operations are permitted.

## Security Features

- **JWT Authentication**: All endpoints (except auth) require valid JWT tokens
- **Draft Only**: Posts are always created with 'draft' status
- **User Isolation**: Users can only see their own draft posts
- **Permission Checks**: Only users with 'edit_posts' capability can access the API
- **Token Expiration**: JWT tokens expire after 24 hours

## Configuration

### JWT Secret Key

For production, add this to your `wp-config.php`:

```php
define('JWT_SECRET_KEY', 'your-super-secret-jwt-key-here-make-it-long-and-random');
```

## API Endpoints

### 1. Authentication

**POST** `/wp-json/draft-api/v1/auth`

Get a JWT token for API access.

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "display_name": "Admin"
  },
  "expires_in": 86400
}
```

### 2. Create Draft Post

**POST** `/wp-json/draft-api/v1/create-draft`

Create a new draft post (always created as draft status).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Draft Post",
  "content": "<p>This is the post content</p>",
  "excerpt": "Post excerpt",
  "categories": ["Technology", "WordPress"],
  "tags": ["api", "draft", "wordpress"],
  "featured_image": 123,
  "meta": {
    "custom_field": "custom_value"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Draft post created successfully",
  "post": {
    "id": 456,
    "title": "My Draft Post",
    "slug": "my-draft-post",
    "content": "<p>This is the post content</p>",
    "excerpt": "Post excerpt",
    "status": "draft",
    "date": "2024-01-01 12:00:00",
    "modified": "2024-01-01 12:00:00",
    "author": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com"
    },
    "featured_image": {
      "id": 123,
      "url": "https://example.com/image.jpg",
      "width": 800,
      "height": 600,
      "alt": "Image alt text"
    },
    "categories": [...],
    "tags": ["api", "draft", "wordpress"],
    "permalink": "https://example.com/?p=456",
    "edit_link": "https://example.com/wp-admin/post.php?post=456&action=edit"
  }
}
```

### 3. Get My Draft Posts

**GET** `/wp-json/draft-api/v1/my-drafts`

Get the authenticated user's draft posts (read-only).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `per_page` (optional): Number of posts per page (default: 10)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": 456,
      "title": "My Draft Post",
      // ... full post data
    }
  ],
  "pagination": {
    "total": 25,
    "pages": 3,
    "current_page": 1,
    "per_page": 10
  }
}
```

## Usage Examples

### JavaScript/Fetch Example

```javascript
// 1. Authenticate
const authResponse = await fetch('/wp-json/draft-api/v1/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'your_username',
    password: 'your_password'
  })
});

const authData = await authResponse.json();
const token = authData.token;

// 2. Create draft post
const createResponse = await fetch('/wp-json/draft-api/v1/create-draft', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My New Draft Post',
    content: '<p>This is my draft content</p>',
    categories: ['Technology'],
    tags: ['api', 'draft']
  })
});

const createData = await createResponse.json();
console.log('Created post:', createData.post);

// 3. Get my drafts
const draftsResponse = await fetch('/wp-json/draft-api/v1/my-drafts', {
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});

const draftsData = await draftsResponse.json();
console.log('My drafts:', draftsData.posts);
```

### cURL Examples

```bash
# 1. Authenticate
curl -X POST "https://yoursite.com/wp-json/draft-api/v1/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'

# 2. Create draft post (replace TOKEN with actual token)
curl -X POST "https://yoursite.com/wp-json/draft-api/v1/create-draft" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Draft Post",
    "content": "<p>Draft content</p>",
    "categories": ["Technology"],
    "tags": ["api", "draft"]
  }'

# 3. Get my drafts
curl -X GET "https://yoursite.com/wp-json/draft-api/v1/my-drafts" \
  -H "Authorization: Bearer TOKEN"
```

## Error Responses

### Authentication Errors
```json
{
  "code": "authentication_failed",
  "message": "Invalid username or password",
  "data": {
    "status": 401
  }
}
```

### Authorization Errors
```json
{
  "code": "no_token",
  "message": "Authorization token is required",
  "data": {
    "status": 401
  }
}
```

```json
{
  "code": "invalid_token",
  "message": "Invalid or expired token",
  "data": {
    "status": 401
  }
}
```

### Permission Errors
```json
{
  "code": "insufficient_permissions",
  "message": "User does not have permission to create posts",
  "data": {
    "status": 403
  }
}
```

## Security Notes

1. **HTTPS Required**: Always use HTTPS in production to protect JWT tokens
2. **Token Storage**: Store JWT tokens securely (not in localStorage for sensitive apps)
3. **Token Expiration**: Tokens expire after 24 hours - implement refresh logic
4. **Secret Key**: Use a strong, unique JWT secret key in production
5. **User Permissions**: Only users with 'edit_posts' capability can access the API

## Removed Features

The following features from the original API have been removed for security:

- ❌ Update post endpoint
- ❌ Delete post endpoint  
- ❌ Publish post capability (all posts are draft only)
- ❌ Public access (JWT required)
- ❌ Cross-user post access (users only see their own drafts)

## Installation

1. Upload the plugin to `/wp-content/plugins/draft-post-api/`
2. Activate the plugin through the WordPress admin
3. Add JWT_SECRET_KEY to wp-config.php
4. Test the API endpoints

## Debug

To debug registered routes, visit:
`https://yoursite.com/?debug_secure_draft_api=1` (admin only)