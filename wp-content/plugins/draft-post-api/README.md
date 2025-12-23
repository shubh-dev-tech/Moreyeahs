# Draft Post API Plugin

A WordPress plugin that provides REST API endpoints for creating, reading, updating, and deleting posts in draft mode.

## Features

- Create posts in draft mode via POST API
- Retrieve draft posts with pagination
- Update existing draft posts
- Delete draft posts
- Support for categories, tags, featured images, and custom meta fields
- CORS support for cross-origin requests
- Proper permission checking

## Installation

1. Copy the plugin folder to `wp-content/plugins/draft-post-api/`
2. Activate the plugin in WordPress admin
3. The REST API endpoints will be available at `/wp-json/draft-api/v1/`

## API Endpoints

### 1. Create Draft Post

**Endpoint:** `POST /wp-json/draft-api/v1/create-post`

**Required Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Draft Post",
  "content": "<p>This is the post content</p>",
  "excerpt": "This is a short excerpt",
  "categories": ["Technology", "Web Development"],
  "tags": ["wordpress", "api", "draft"],
  "featured_image": 123,
  "author": 1,
  "meta": {
    "custom_field_1": "value1",
    "custom_field_2": "value2"
  }
}
```

**Response:**
```json
{
  "id": 456,
  "title": "My Draft Post",
  "slug": "my-draft-post",
  "content": "<p>This is the post content</p>",
  "excerpt": "This is a short excerpt",
  "status": "draft",
  "date": "2023-12-23 10:30:00",
  "modified": "2023-12-23 10:30:00",
  "author": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "featured_image": {
    "id": 123,
    "url": "https://example.com/wp-content/uploads/image.jpg",
    "width": 800,
    "height": 600,
    "alt": "Featured image"
  },
  "categories": [...],
  "tags": ["wordpress", "api", "draft"],
  "permalink": "https://example.com/?p=456",
  "edit_link": "https://example.com/wp-admin/post.php?post=456&action=edit"
}
```

### 2. Get Draft Posts

**Endpoint:** `GET /wp-json/draft-api/v1/draft-posts`

**Query Parameters:**
- `per_page` (optional): Number of posts per page (default: 10)
- `page` (optional): Page number (default: 1)
- `author` (optional): Filter by author ID

**Example:** `GET /wp-json/draft-api/v1/draft-posts?per_page=5&page=1`

### 3. Update Draft Post

**Endpoint:** `PUT /wp-json/draft-api/v1/update-post/{id}`

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "<p>Updated content</p>",
  "status": "publish",
  "categories": [1, 2],
  "tags": ["updated", "published"]
}
```

### 4. Delete Draft Post

**Endpoint:** `DELETE /wp-json/draft-api/v1/delete-post/{id}`

**Response:**
```json
{
  "deleted": true,
  "id": 456,
  "message": "Post deleted successfully"
}
```

## Usage Examples

### JavaScript/Fetch API

```javascript
// Create a draft post
const createDraftPost = async () => {
  const response = await fetch('/wp-json/draft-api/v1/create-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': wpApiSettings.nonce // If using WordPress nonce
    },
    body: JSON.stringify({
      title: 'My New Draft',
      content: '<p>This is my draft content</p>',
      categories: ['News', 'Updates'],
      tags: ['draft', 'api']
    })
  });
  
  const data = await response.json();
  console.log('Created post:', data);
};

// Get draft posts
const getDraftPosts = async () => {
  const response = await fetch('/wp-json/draft-api/v1/draft-posts?per_page=10');
  const posts = await response.json();
  console.log('Draft posts:', posts);
};

// Update a draft post
const updateDraftPost = async (postId) => {
  const response = await fetch(`/wp-json/draft-api/v1/update-post/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Updated Title',
      status: 'publish'
    })
  });
  
  const data = await response.json();
  console.log('Updated post:', data);
};
```

### cURL Examples

```bash
# Create a draft post
curl -X POST "https://yoursite.com/wp-json/draft-api/v1/create-post" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Draft Post",
    "content": "<p>This is the content</p>",
    "categories": ["Technology"],
    "tags": ["wordpress", "api"]
  }'

# Get draft posts
curl "https://yoursite.com/wp-json/draft-api/v1/draft-posts?per_page=5"

# Update a draft post
curl -X PUT "https://yoursite.com/wp-json/draft-api/v1/update-post/123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "publish"
  }'

# Delete a draft post
curl -X DELETE "https://yoursite.com/wp-json/draft-api/v1/delete-post/123"
```

### PHP Example

```php
// Create a draft post using WordPress HTTP API
$response = wp_remote_post('https://yoursite.com/wp-json/draft-api/v1/create-post', array(
    'headers' => array(
        'Content-Type' => 'application/json'
    ),
    'body' => json_encode(array(
        'title' => 'My Draft Post',
        'content' => '<p>This is the content</p>',
        'categories' => array('Technology'),
        'tags' => array('wordpress', 'api')
    ))
));

if (!is_wp_error($response)) {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    echo 'Created post ID: ' . $data['id'];
}
```

## Permissions

By default, the API requires users to have the `edit_posts` capability. You can modify the `check_permissions()` method in the plugin to customize access control.

For development/testing purposes, you can uncomment the `return true;` line in the `check_permissions()` method to allow public access (not recommended for production).

## CORS Support

The plugin includes CORS headers for cross-origin requests. Allowed origins include:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:8000`
- Your WordPress site URL

You can add custom allowed origins by defining `ALLOWED_ORIGIN` in your `wp-config.php`:

```php
define('ALLOWED_ORIGIN', 'https://your-frontend-domain.com');
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (missing required parameters)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (post doesn't exist)
- `500` - Internal Server Error (database or other errors)

## Security Considerations

1. Always validate and sanitize input data
2. Use proper authentication for production environments
3. Consider rate limiting for public APIs
4. Regularly update WordPress and the plugin
5. Monitor API usage and logs

## Changelog

### Version 1.0.0
- Initial release
- Create, read, update, delete draft posts
- Support for categories, tags, featured images
- Custom meta fields support
- CORS support
- Proper error handling and validation