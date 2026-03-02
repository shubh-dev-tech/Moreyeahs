# Inner Circle Videos Block - Quick Start Guide

## ✅ Installation Complete

All files have been created and configured. The block is ready to use!

## 🚀 Quick Start (3 Steps)

### Step 1: Add Block in WordPress
1. Edit any page in WordPress
2. Click **"+"** button
3. Search for **"Inner Circle Videos"**
4. Add the block

### Step 2: Configure Block
1. **Heading**: "Inner Circle Videos" (or customize)
2. **Subheading**: "Real stories and insights straight from our team."
3. **Background Image** (Optional): Upload a background image
4. **Add Videos**: Click "Add Video" button

### Step 3: Add Team Videos
For each team member:
- **Name**: e.g., "Sarah Jenkins"
- **Job Title**: e.g., "Project Manager"  
- **Thumbnail**: Upload photo (600x400px recommended)
- **Video URL**: Paste YouTube, Vimeo, or MP4 link

## 📹 Video URL Examples

```
YouTube:
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ

Vimeo:
https://vimeo.com/123456789

Direct MP4:
https://example.com/video.mp4
```

## 🎨 Features

✅ **Infinite Loop Slider** - Seamlessly loops forever
✅ **Auto-Advance** - Changes every 5 seconds
✅ **Video Popup** - Full-screen video player
✅ **Touch/Drag** - Swipe on mobile, drag on desktop
✅ **Responsive** - Works on all devices
✅ **Background Image** - Optional background with overlay

## 🔧 Customization

### Change Autoplay Speed
Edit line ~150 in both files:
- `wp-content/themes/twentytwentyfive-child/blocks/inner-circle-videos/script.js`
- `nextjs-wordpress/src/components/blocks/inner-circle-videos/InnerCircleVideosBlock.tsx`

```javascript
}, 5000); // Change to 3000 for 3 seconds, 7000 for 7 seconds, etc.
```

### Adjust Background Visibility
Edit CSS files:
- `wp-content/themes/twentytwentyfive-child/blocks/inner-circle-videos/style.css`
- `nextjs-wordpress/src/components/blocks/inner-circle-videos/styles.scss`

```css
.inner-circle-videos::before {
    background: rgba(248, 249, 250, 0.95); /* Default: 95% overlay */
    background: rgba(248, 249, 250, 0.85); /* More visible: 85% */
    background: rgba(248, 249, 250, 0.70); /* Very visible: 70% */
}
```

### Change Colors
```css
.inner-circle-videos {
    background: #f8f9fa; /* Section background */
}

.inner-circle-videos__card {
    background: white; /* Card background */
}

.inner-circle-videos__heading {
    color: #1a1a1a; /* Heading color */
}
```

## 🐛 Troubleshooting

### Block Not Showing in Next.js?
1. Restart Next.js dev server: `npm run dev`
2. Clear build cache: `rm -rf .next`
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Background Image Not Showing?
1. Check image is uploaded to WordPress media library
2. Verify image URL in ACF field
3. Check browser console for 404 errors

### Autoplay Not Working?
1. Check browser console for errors
2. Ensure at least 1 video is added
3. Try refreshing the page

### Videos Not Playing?
1. Check video URL is correct
2. For YouTube: Ensure video is public
3. For Vimeo: Check privacy settings
4. For MP4: Verify file is accessible

## 📱 Responsive Behavior

- **Desktop (>1024px)**: Shows 2 slides
- **Tablet (768-1024px)**: Shows 1.5 slides  
- **Mobile (<768px)**: Shows 1 slide

## ⌨️ Keyboard Shortcuts

- **Escape**: Close video modal
- **Drag/Swipe**: Navigate slides

## 📊 Performance Tips

1. **Optimize Images**: Use WebP format, compress before upload
2. **Video Hosting**: Use YouTube/Vimeo for better performance
3. **Limit Videos**: 5-10 videos recommended
4. **Image Size**: Keep thumbnails under 200KB

## 🎯 Best Practices

1. **Add 3+ Videos**: Slider works best with multiple videos
2. **Consistent Thumbnails**: Use same aspect ratio (4:3 or 16:9)
3. **Short Videos**: 1-3 minutes ideal for engagement
4. **High Quality**: Use HD thumbnails and videos
5. **Test Mobile**: Always test on mobile devices

## 📞 Need Help?

Check these files for detailed documentation:
- `INNER-CIRCLE-VIDEOS-GUIDE.md` - Complete guide
- `INNER-CIRCLE-VIDEOS-FIXES.md` - Technical fixes
- `wp-content/themes/twentytwentyfive-child/blocks/inner-circle-videos/README.md` - Block documentation

---

**Ready to use!** Add the block to your page and start showcasing your team! 🎉
