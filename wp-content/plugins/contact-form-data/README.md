# Contact Form Data Plugin

A WordPress plugin that captures contact form submissions from Next.js frontend and provides CSV export functionality.

## Features

- Captures form submissions via REST API
- Admin interface to view all submissions
- CSV export functionality
- Email notifications for new submissions
- Secure data handling with nonce verification
- Responsive admin interface

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The plugin will automatically create the required database table

## Usage

### For Next.js Frontend

Send POST requests to the WordPress REST API endpoint:

```
POST /wp-json/contact-form/v1/submit
```

**Required fields:**
- `name` (string)
- `email` (string)

**Optional fields:**
- `phone` (string)
- `subject` (string)
- `message` (string)

**Example JavaScript code for Next.js:**

```javascript
const submitForm = async (formData) => {
  try {
    const response = await fetch('http://localhost/moreyeahs-new/wp-json/contact-form/v1/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Form submitted successfully!');
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### WordPress Admin

1. Go to **Contact Forms** in the WordPress admin menu
2. View all submissions in the main page
3. Click "Export All to CSV" to download submissions
4. Use "View" to see full message content
5. Use "Delete" to remove submissions

## Database Schema

The plugin creates a table `wp_contact_form_submissions` with the following fields:

- `id` - Auto-increment primary key
- `name` - Submitter's name
- `email` - Submitter's email
- `phone` - Phone number (optional)
- `subject` - Form subject (optional)
- `message` - Form message (optional)
- `submitted_at` - Timestamp
- `ip_address` - Submitter's IP
- `user_agent` - Browser information

## API Endpoints

### Submit Form
- **URL:** `/wp-json/contact-form/v1/submit`
- **Method:** POST
- **Auth:** None required
- **Response:** JSON with success status and message

### Get Submissions (Admin only)
- **URL:** `/wp-json/contact-form/v1/submissions`
- **Method:** GET
- **Auth:** Admin privileges required
- **Parameters:** `page`, `per_page`

## Security Features

- Input sanitization and validation
- Nonce verification for admin actions
- Permission checks for sensitive operations
- SQL injection prevention with prepared statements

## Customization

You can customize the plugin by:

1. Modifying email notification templates in `class-api-handler.php`
2. Adding custom fields to the database schema
3. Styling the admin interface via `assets/admin-style.css`
4. Adding custom validation rules

## Support

For issues or feature requests, please contact the plugin developer.