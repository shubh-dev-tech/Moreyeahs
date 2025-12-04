# Appearance Settings - Quick Start

## 🎨 Update Your Site Appearance in 3 Steps

### Step 1: Access WordPress Customizer
1. Log in to WordPress admin: `http://your-domain.com/wp-admin`
2. Go to **Appearance → Customize**

### Step 2: Update Site Identity
Click **Site Identity** and update:
- ✏️ **Site Title** - Your site name
- 📝 **Tagline** - Brief description
- 🖼️ **Logo** - Click "Select Logo" to upload (PNG/JPG, max 400x100px)
- 🎯 **Site Icon** - Click "Select Site Icon" to upload favicon (PNG, 512x512px)

### Step 3: Publish Changes
Click the **Publish** button at the top

## ✅ That's It!

Your changes will automatically appear on your Next.js site:
- Logo in the header navigation
- Favicon in browser tabs
- Site title in page titles and SEO
- Description in meta tags

## 🔍 Quick Test

After publishing, check:
1. Refresh your Next.js site homepage
2. Look for your logo in the header
3. Check the browser tab for your favicon
4. View page source to see updated meta tags

## 📍 API Endpoint

Your site settings are available at:
```
http://your-domain.com/wp-json/wp/v2/site-settings
```

## 💡 Tips

- **Logo**: Use transparent PNG for best results
- **Favicon**: Use simple, high-contrast design
- **Title**: Keep under 60 characters
- **Description**: Keep under 160 characters

## 🐛 Not Working?

1. Hard refresh browser (Ctrl+Shift+R)
2. Check the API endpoint is accessible
3. Verify `.env` has correct `WORDPRESS_REST_API_URL`
4. Clear browser cache

For detailed instructions, see [APPEARANCE_SETTINGS.md](./APPEARANCE_SETTINGS.md)
