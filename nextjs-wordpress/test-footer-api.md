# Test Footer Widgets API

## Quick Test Steps

### 1. Test the API Endpoint

Open this URL in your browser (replace with your WordPress URL):

```
http://localhost/moreyeahs-new/wp-json/wp/v2/footer-widgets
```

You should see JSON output like:
```json
{
  "column1": {
    "id": "footer-column-1",
    "title": "",
    "content": "...",
    "links": []
  },
  "copyrightLeft": "",
  "copyrightRight": ""
}
```

### 2. Add Copyright Text

1. Go to WordPress Admin
2. Navigate to **Settings > General**
3. Scroll to **Footer Copyright Settings**
4. Add text to both fields:
   - Left: `© {year} All rights reserved.`
   - Right: `Powered by Next.js & WordPress`
5. Click **Save Changes**

### 3. Test Again

Refresh the API URL. You should now see:
```json
{
  "copyrightLeft": "© 2025 All rights reserved.",
  "copyrightRight": "Powered by Next.js & WordPress"
}
```

### 4. Check Your Next.js Site

1. Restart your Next.js dev server (if running)
2. Or rebuild: `npm run build`
3. Visit your site
4. Scroll to the footer
5. You should see the copyright text on both sides

## Troubleshooting

### Copyright Settings Not Showing in WordPress

**Solution:** The code has been added to your `functions.php`. Try:
1. Refresh the Settings > General page (Ctrl+F5)
2. Clear any WordPress caching plugins
3. Make sure you're logged in as an administrator

### API Returns Empty Copyright

**Cause:** You haven't added the text yet in WordPress Settings.

**Solution:** Go to Settings > General and add your copyright text.

### Footer Not Showing on Next.js Site

**Cause:** Cache or build issue.

**Solution:**
```bash
cd nextjs-wordpress
npm run build
# or restart dev server
```

### Images/Social Icons Still Not Showing

**Check:**
1. Are the images uploaded to WordPress Media Library?
2. Are they added to the footer widget with proper HTML?
3. Check browser console for any 404 errors on image URLs
