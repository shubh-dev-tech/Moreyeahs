# Visual Guide: Updating Site Appearance

## 📍 Step-by-Step Visual Guide

### Step 1: Access WordPress Admin

```
Navigate to: http://your-domain.com/wp-admin
```

**What you'll see:**
- WordPress login screen
- Enter your username and password
- Click "Log In"

---

### Step 2: Open Customizer

**Option A: From Dashboard**
```
Dashboard → Appearance → Customize
```

**Option B: From Admin Bar**
```
Click "Customize" in the top admin bar (if viewing site)
```

**What you'll see:**
- Left panel: Customizer options
- Right panel: Live preview of your site

---

### Step 3: Open Site Identity

**In the Customizer left panel:**
```
Click: Site Identity
```

**What you'll see:**
```
┌─────────────────────────────────┐
│ ← Site Identity                 │
├─────────────────────────────────┤
│                                 │
│ Site Title                      │
│ [Your Site Name            ]    │
│                                 │
│ Tagline                         │
│ [Your site description     ]    │
│                                 │
│ Logo                            │
│ [Select Logo]                   │
│                                 │
│ Site Icon                       │
│ [Select Site Icon]              │
│                                 │
│ ☐ Display Site Title and        │
│   Tagline                       │
│                                 │
└─────────────────────────────────┘
```

---

### Step 4: Update Site Title

**Field: Site Title**
```
Current: My Site
Update to: Your Awesome Site Name
```

**This appears:**
- Browser tab title
- Header (if no logo)
- SEO meta tags
- Search engine results

---

### Step 5: Update Tagline

**Field: Tagline**
```
Current: Just another WordPress site
Update to: Your compelling site description
```

**This appears:**
- SEO meta description
- Search engine results
- Social media shares

---

### Step 6: Upload Logo

**Click: "Select Logo" button**

**You'll see Media Library:**
```
┌─────────────────────────────────┐
│ Upload Files | Media Library    │
├─────────────────────────────────┤
│                                 │
│  [Drag files here]              │
│                                 │
│  or                             │
│                                 │
│  [Select Files]                 │
│                                 │
└─────────────────────────────────┘
```

**Upload your logo:**
1. Click "Select Files" or drag & drop
2. Choose your logo file (PNG/JPG/SVG)
3. Wait for upload to complete
4. Click "Select" button

**Logo Recommendations:**
- Format: PNG with transparent background
- Size: 400px wide × 100px tall (max)
- File size: Under 200KB
- High resolution for retina displays

**After selecting:**
```
┌─────────────────────────────────┐
│ Logo                            │
│ ┌─────────────────────────┐     │
│ │                         │     │
│ │   [Your Logo Image]     │     │
│ │                         │     │
│ └─────────────────────────┘     │
│                                 │
│ [Change Logo] [Remove]          │
│                                 │
│ ☐ Display Site Title and        │
│   Tagline                       │
└─────────────────────────────────┘
```

**Tip:** Uncheck "Display Site Title and Tagline" if your logo includes text

---

### Step 7: Upload Favicon (Site Icon)

**Scroll down to: "Site Icon"**

**Click: "Select Site Icon" button**

**You'll see Media Library again:**
```
┌─────────────────────────────────┐
│ Upload Files | Media Library    │
├─────────────────────────────────┤
│                                 │
│  Site Icon Requirements:        │
│  • Square image                 │
│  • At least 512 × 512 pixels    │
│                                 │
│  [Drag files here]              │
│                                 │
│  or                             │
│                                 │
│  [Select Files]                 │
│                                 │
└─────────────────────────────────┘
```

**Upload your favicon:**
1. Click "Select Files" or drag & drop
2. Choose your icon file (PNG recommended)
3. Wait for upload to complete
4. **Crop if needed** (must be square)
5. Click "Select" button

**Favicon Recommendations:**
- Format: PNG (best quality)
- Size: 512px × 512px (square)
- Simple design (will be tiny)
- High contrast colors
- No fine details

**After selecting:**
```
┌─────────────────────────────────┐
│ Site Icon                       │
│ ┌─────┐                         │
│ │ 🎯  │ Preview                 │
│ └─────┘                         │
│                                 │
│ [Change Image] [Remove]         │
│                                 │
│ Site Icons are used as a        │
│ browser and app icon for        │
│ your site.                      │
└─────────────────────────────────┘
```

---

### Step 8: Publish Changes

**At the top of the Customizer:**
```
┌─────────────────────────────────┐
│ [← ] Customizing    [Publish] ✓ │
└─────────────────────────────────┘
```

**Click: "Publish" button**

**What happens:**
- Changes are saved to WordPress
- Live site updates immediately
- Next.js site fetches new data
- Logo appears in header
- Favicon appears in browser tabs

---

## 🎯 Where Your Changes Appear

### Logo Appears In:
```
┌─────────────────────────────────────────┐
│ [Your Logo] Home About Blog Contact    │ ← Header
└─────────────────────────────────────────┘
```

### Favicon Appears In:
```
Browser Tab:
┌──────────────────────┐
│ 🎯 Your Site Name    │ ← Your favicon here
└──────────────────────┘

Bookmarks:
🎯 Your Site Name

Mobile Home Screen:
┌─────┐
│ 🎯  │
│Site │
└─────┘
```

### Site Title Appears In:
- Browser tab title
- Search engine results
- Social media shares
- Bookmark names
- SEO meta tags

---

## 🔍 Verify Your Changes

### 1. Check the Header
```
Visit: http://your-domain.com
Look for: Your logo in the top-left corner
```

### 2. Check the Favicon
```
Look at: Browser tab
Should see: Your icon instead of default WordPress icon
```

### 3. Check the API
```
Visit: http://your-domain.com/wp-json/wp/v2/site-settings
Should see: JSON with your logo and favicon URLs
```

### 4. Check Page Title
```
Look at: Browser tab title
Should see: Your site name
```

---

## 🎨 Design Tips

### Logo Design
```
✅ DO:
- Use transparent background (PNG)
- Keep it simple and readable
- Use vector format (SVG) if possible
- Test on light and dark backgrounds
- Make it recognizable at small sizes

❌ DON'T:
- Use too many colors
- Include fine details
- Make it too tall (max 100px height)
- Use low-resolution images
- Include text that's too small
```

### Favicon Design
```
✅ DO:
- Use simple, bold shapes
- Use high contrast colors
- Make it recognizable at 16×16px
- Use your brand colors
- Keep it square

❌ DON'T:
- Use complex illustrations
- Include text (too small to read)
- Use similar colors (low contrast)
- Make it rectangular
- Use gradients (may not show well)
```

---

## 📱 Mobile Preview

**In the Customizer, test mobile view:**

**Bottom of Customizer:**
```
┌─────────────────────────────────┐
│ 💻 Desktop  📱 Tablet  📱 Mobile│
└─────────────────────────────────┘
```

**Click each icon to preview:**
- Desktop view (default)
- Tablet view (768px)
- Mobile view (375px)

**Check that:**
- Logo scales properly
- Logo doesn't overlap menu
- Favicon is visible
- Everything looks good

---

## 🔄 Update Existing Settings

**To change logo later:**
```
1. Go to: Appearance → Customize → Site Identity
2. Click: "Change Logo" button
3. Select new image
4. Click: "Publish"
```

**To remove logo:**
```
1. Go to: Appearance → Customize → Site Identity
2. Click: "Remove" button next to logo
3. Click: "Publish"
4. Site will show text title instead
```

**To change favicon:**
```
1. Go to: Appearance → Customize → Site Identity
2. Scroll to: "Site Icon"
3. Click: "Change Image" button
4. Select new icon
5. Click: "Publish"
```

---

## 🐛 Troubleshooting Visual Issues

### Logo Not Showing
```
Check:
1. Is logo uploaded in Customizer? ✓
2. Is "Publish" button clicked? ✓
3. Is image URL accessible? ✓
4. Browser cache cleared? ✓
```

### Logo Too Big/Small
```
Solution:
1. Edit image in photo editor
2. Resize to max 400×100px
3. Re-upload in Customizer
4. Publish changes
```

### Logo Blurry
```
Solution:
1. Use higher resolution image
2. Use 2x size for retina displays
3. Use SVG format (scales perfectly)
4. Re-upload and publish
```

### Favicon Not Updating
```
Solution:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache completely
3. Try incognito/private window
4. Wait 5-10 minutes for cache to clear
5. Close and reopen browser
```

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Logo appears in header
- [ ] Logo is clear and not blurry
- [ ] Logo scales properly on mobile
- [ ] Favicon shows in browser tab
- [ ] Favicon shows in bookmarks
- [ ] Site title is correct in tab
- [ ] Site title is correct in search results
- [ ] Changes visible on all pages
- [ ] Changes visible on mobile devices
- [ ] API endpoint returns correct data

---

## 🎓 Next Steps

Now that your branding is set up:

1. **Create Navigation Menu**
   - Go to: Appearance → Menus
   - Create menu items
   - Assign to "Primary Menu" location

2. **Add Content**
   - Create pages
   - Write blog posts
   - Add featured images

3. **Configure SEO**
   - Install Yoast SEO
   - Set up meta descriptions
   - Configure social sharing

4. **Test Everything**
   - Check all pages
   - Test on mobile
   - Verify SEO tags
   - Test social sharing

---

## 📚 Additional Resources

- **Quick Start**: [APPEARANCE_QUICK_START.md](./APPEARANCE_QUICK_START.md)
- **Detailed Guide**: [APPEARANCE_SETTINGS.md](./APPEARANCE_SETTINGS.md)
- **Technical Details**: [APPEARANCE_IMPLEMENTATION.md](./APPEARANCE_IMPLEMENTATION.md)
- **Main README**: [README.md](./README.md)

---

**Need Help?**

Run the test script to diagnose issues:
```bash
node test-appearance-api.js
```

This will show you exactly what data WordPress is returning and help identify any problems.
