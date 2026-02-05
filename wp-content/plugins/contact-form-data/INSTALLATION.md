# Installation Guide - Contact Form Data Plugin

## Step 1: Activate the Plugin

1. Go to your WordPress admin dashboard
2. Navigate to **Plugins** → **Installed Plugins**
3. Find "Contact Form Data" in the list
4. Click **Activate**

## Step 2: Verify Installation

1. After activation, you should see a new menu item **"Contact Forms"** in your WordPress admin sidebar
2. Click on it to access the plugin dashboard
3. The plugin will automatically create the required database table `wp_contact_form_submissions`

## Step 3: Test the API

### Option A: Use the Test File
1. Open `wp-content/plugins/contact-form-data/test-api.html` in your browser
2. Fill out the form and submit
3. Check if the submission appears in WordPress admin under **Contact Forms**

### Option B: Test with cURL
```bash
curl -X POST http://localhost/moreyeahs-new/wp-json/contact-form/v1/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "123-456-7890",
    "subject": "Test Subject",
    "message": "This is a test message"
  }'
```

## Step 4: Configure Your Next.js Frontend

1. Copy the example component from `examples/nextjs-contact-form.jsx`
2. Update the API URL to match your WordPress installation:
   ```javascript
   const response = await fetch('http://localhost/moreyeahs-new/wp-json/contact-form/v1/submit', {
   ```
3. Customize the form fields and styling as needed

## Step 5: Verify Data Collection

1. Submit a test form from your Next.js frontend
2. Go to WordPress admin → **Contact Forms**
3. You should see the submission listed
4. Test the CSV export functionality

## API Endpoints

### Submit Form (Public)
- **URL:** `http://localhost/moreyeahs-new/wp-json/contact-form/v1/submit`
- **Method:** POST
- **Content-Type:** application/json

### Get Submissions (Admin Only)
- **URL:** `http://localhost/moreyeahs-new/wp-json/contact-form/v1/submissions`
- **Method:** GET
- **Auth:** WordPress admin login required

## Troubleshooting

### Common Issues:

1. **Plugin not appearing in admin menu**
   - Make sure the plugin is activated
   - Check if you have admin privileges

2. **API returns 404 error**
   - Verify WordPress permalinks are enabled
   - Check if the URL is correct
   - Ensure the plugin is activated

3. **Form submissions not saving**
   - Check WordPress error logs
   - Verify database permissions
   - Test with the provided test file

4. **CORS issues from Next.js**
   - Add CORS headers to your WordPress installation
   - Or use a proxy in your Next.js development setup

### Enable WordPress Debug Mode (if needed):
Add these lines to your `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Check logs in `/wp-content/debug.log`

## Next Steps

1. Customize email notifications in `includes/class-api-handler.php`
2. Add custom fields to the form and database schema
3. Style the admin interface to match your needs
4. Set up automated backups of form submissions

## Support

If you encounter any issues:
1. Check the WordPress error logs
2. Verify all files are uploaded correctly
3. Ensure proper file permissions
4. Test the API endpoints directly