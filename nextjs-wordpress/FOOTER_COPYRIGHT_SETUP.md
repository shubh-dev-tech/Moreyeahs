# Footer Copyright Setup Guide

## Setting Up Copyright Text in WordPress

After uploading the updated `footer-widgets-api.php` to your WordPress theme, you can configure the copyright text:

### Steps:

1. **Go to WordPress Admin Dashboard**
   - Navigate to: `Settings > General`

2. **Scroll to Footer Copyright Settings**
   - You'll see two new fields:
     - **Copyright Left Text** (displays on the left side)
     - **Copyright Right Text** (displays on the right side)

3. **Add Your Copyright Text**

   **Example for Left Side:**
   ```html
   © {year} All rights reserved.
   ```
   
   **Example for Right Side:**
   ```html
   Powered by <a href="https://nextjs.org">Next.js</a> & <a href="https://wordpress.org">WordPress</a>
   ```

4. **Using the {year} Placeholder**
   - Use `{year}` in your text and it will automatically be replaced with the current year
   - Example: `© {year} Your Company` becomes `© 2025 Your Company`

5. **HTML Support**
   - Both fields support HTML
   - You can add links, bold text, etc.
   - Example: `<strong>© {year}</strong> <a href="/privacy">Privacy Policy</a>`

6. **Save Changes**
   - Click "Save Changes" at the bottom of the page

## What Was Fixed

1. **Duplicate Menu Items** - Menu items no longer appear in both heading and content
2. **Title Placement** - Widget titles now correctly appear in the `<h4>` heading
3. **Content Cleanup** - Menu lists are removed from content when links are extracted
4. **Image Support** - Images and social icons now display properly in footer content
5. **Copyright Display** - Copyright sections now show with proper styling and links

## Testing

After setting up:
1. Check that copyright text appears on both left and right sides
2. Verify that menu widgets show title in heading and links below
3. Confirm images/social icons are visible
4. Test that links work correctly

## Troubleshooting

If copyright text doesn't appear:
- Make sure you saved the settings in WordPress
- Clear your Next.js cache: `npm run build` or restart dev server
- Check browser console for any API errors
