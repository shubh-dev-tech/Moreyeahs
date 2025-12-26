# Case Study Template Guide

## Overview
Your case study post type now has predefined templates that automatically load when creating new case studies. This saves time and ensures consistency across all your case studies.

## Available Templates

### 1. Default Template (Complete)
The default template includes all available ACF blocks in a logical order:

- **Header Block** - Gradient background with logo, title, and subtitle
- **Layout Container** with:
  - **Left Sidebar** - Client info, industry, services, timeline
  - **Content Area** with:
    - Meet the Client section
    - The Challenge section
    - Our Solution section  
    - The Results section
    - Testimonial Quote
    - Call-to-Action section

### 2. Minimal Template
A simplified template with essential sections:
- Header Block
- Project Overview content section
- Call-to-Action

### 3. Detailed Template
Extended version of the default template (currently same as default, can be customized)

## How It Works

### For New Case Studies
1. Go to **Case Studies > Add New**
2. The default template will automatically load with placeholder content
3. Simply replace the placeholder text with your actual content
4. All ACF blocks are pre-configured and ready to use

### For Existing Case Studies
1. Edit any existing case study
2. Look for the **"Case Study Template"** meta box on the right sidebar
3. Select your desired template
4. Click **"Apply Template"** 
5. Confirm the action (this will replace existing content)

### Template Management
- Go to **Case Studies > Templates** to view available templates
- See template structures and usage instructions
- Access quick actions for creating new case studies

## Customizing Templates

### Modifying Existing Templates
Edit the template functions in:
```
wp-content/themes/twentytwentyfive-child/inc/case-study-template.php
```

Key functions:
- `get_case_study_template_content()` - Default template
- `get_minimal_case_study_template()` - Minimal template
- `get_detailed_case_study_template()` - Detailed template

### Creating New Templates
1. Add a new template function following the existing pattern
2. Update the template selection arrays in both:
   - `case_study_template_meta_box_callback()`
   - `apply_case_study_template_ajax()`
3. Add the new template case in the switch statement

## Block Structure

Each template uses these ACF blocks:

### acf/case-study-header
- Gradient background
- Logo upload
- Title and subtitle fields

### acf/case-study-layout  
- Main container for sidebar and content
- Full-width alignment

### acf/case-study-left-sidebar
- Repeater sections for client info
- Configurable section titles and items

### acf/meet-the-client
- Client image, name, designation
- Company and content fields

### acf/case-study-content-section
- Flexible content section
- Icon, title, content
- Quotes and bullet points repeaters

### acf/case-study-quote
- Standalone quote block
- Quote text and author fields

### acf/case-study-cta
- Call-to-action section
- Title, content, and buttons repeater

## Best Practices

1. **Use Templates Consistently** - Stick to one template style across similar case studies
2. **Customize Placeholder Content** - Replace all placeholder text with actual project details
3. **Optimize Images** - Use high-quality images for client logos and profile pictures
4. **Keep Content Focused** - Each section should have a clear purpose and message
5. **Test Responsiveness** - Preview your case studies on different devices

## Troubleshooting

### Template Not Loading
- Check if ACF is active and field groups are imported
- Verify template files exist in the correct directory
- Check for PHP errors in debug log

### Content Not Saving
- Ensure proper permissions for the user role
- Check if ACF fields are properly configured
- Verify nonce security checks are passing

### Blocks Not Displaying
- Confirm ACF blocks are registered in functions.php
- Check if block template files exist
- Verify CSS files are properly enqueued

## Support

For issues or customizations:
1. Check the WordPress admin error logs
2. Verify all ACF field groups are active
3. Test with a default WordPress theme to isolate issues
4. Review the template functions for any custom modifications needed

## File Locations

- Template Manager: `wp-content/themes/twentytwentyfive-child/inc/case-study-template.php`
- Admin Interface: `wp-content/themes/twentytwentyfive-child/inc/case-study-admin.php`
- Block Templates: `wp-content/themes/twentytwentyfive-child/blocks/*/block.php`
- ACF Field Groups: `wp-content/themes/twentytwentyfive-child/acf-json/`