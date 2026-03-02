# Inner Circle Videos Block - Implementation Guide

## Overview
A custom ACF block that displays team member videos in an infinite loop slider with video popup functionality. Perfect for showcasing team testimonials, insights, and stories.

## Features ✨

### Slider Features
- **Infinite Loop**: Seamlessly loops through videos without visible breaks
- **Autoplay**: Automatically advances every 5 seconds
- **Touch/Drag Support**: Swipe on mobile or drag on desktop
- **Responsive**: Adapts to all screen sizes
- **Pagination Dots**: Visual indicators with active state

### Video Features
- **Multiple Sources**: YouTube, Vimeo, and direct MP4 support
- **Popup Modal**: Full-screen video playback
- **Autoplay on Open**: Videos start automatically in modal
- **Keyboard Support**: Close with Escape key

## Installation Complete ✅

All files have been created:

### WordPress (ACF)
- ✅ `wp-content/themes/twentytwentyfive-child/acf-json/group_inner_circle_videos_block.json`
- ✅ `wp-content/themes/twentytwentyfive-child/blocks/inner-circle-videos/block.php`
- ✅ `wp-content/themes/twentytwentyfive-child/blocks/inner-circle-videos/style.css`
- ✅ `wp-content/themes/twentytwentyfive-child/blocks/inner-circle-videos/script.js`
- ✅ Block registered in `functions.php`

### Next.js Frontend
- ✅ `nextjs-wordpress/src/components/blocks/inner-circle-videos/InnerCircleVideosBlock.tsx`
- ✅ `nextjs-wordpress/src/components/blocks/inner-circle-videos/styles.scss`
- ✅ Block registered in `BlockRenderer.tsx`

## How to Use

### 1. In WordPress Admin

1. **Navigate to any page/post editor**
2. **Click the "+" button** to add a block
3. **Search for "Inner Circle Videos"**
4. **Configure the block:**
   - Enter heading (e.g., "Inner Circle Videos")
   - Enter subheading (e.g., "Real stories and insights straight from our team.")
   - (Optional) Upload background image
   - Add team member videos

### 2. Adding Videos

For each team member:

1. **Name**: Enter team member's name (e.g., "Sarah Jenkins")
2. **Job Title**: Enter their position (e.g., "Project Manager")
3. **Thumbnail Image**: Upload a photo (recommended: 600x400px)
4. **Video URL**: Paste the video link

### 3. Supported Video URLs

#### YouTube
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
```

#### Vimeo
```
https://vimeo.com/123456789
```

#### Direct MP4
```
https://example.com/videos/team-video.mp4
```

## Design Specifications

### Layout
- **Desktop**: Shows 2 slides at once
- **Tablet**: Shows 1.5 slides at once
- **Mobile**: Shows 1 slide at once

### Colors
- Background: `#f8f9fa`
- Card Background: `white`
- Text Primary: `#1a1a1a`
- Text Secondary: `#666`
- Active Dot: `#1a1a1a`
- Inactive Dot: `#d0d0d0`

### Spacing
- Section Padding: `80px 20px` (desktop), `60px 20px` (mobile)
- Card Gap: `30px` (desktop), `20px` (mobile)
- Card Padding: `24px`

### Typography
- Heading: `48px` (desktop), `28px` (mobile)
- Subheading: `18px` (desktop), `16px` (mobile)
- Name: `24px` (desktop), `20px` (mobile)
- Title: `16px` (desktop), `14px` (mobile)

## Customization

### Change Autoplay Speed

**WordPress (script.js):**
```javascript
// Line ~150
autoplayInterval = setInterval(() => {
    nextSlide();
}, 5000); // Change 5000 to desired milliseconds
```

**Next.js (InnerCircleVideosBlock.tsx):**
```typescript
// Line ~150
autoplayRef.current = setInterval(() => {
    nextSlide();
}, 5000); // Change 5000 to desired milliseconds
```

### Change Slide Animation Speed

**CSS (style.css or styles.scss):**
```css
.inner-circle-videos__slider {
    transition: transform 0.5s ease; /* Change 0.5s to desired duration */
}
```

### Change Colors

**CSS (style.css or styles.scss):**
```css
.inner-circle-videos {
    background: #f8f9fa; /* Change background color */
}

.inner-circle-videos::before {
    background: rgba(248, 249, 250, 0.95); /* Overlay opacity */
}

.inner-circle-videos__card {
    background: white; /* Change card background */
}

.inner-circle-videos__heading {
    color: #1a1a1a; /* Change heading color */
}
```

### Adjust Background Image Visibility

To make the background image more or less visible:

**CSS (style.css or styles.scss):**
```css
.inner-circle-videos::before {
    /* Adjust the last value (opacity) */
    background: rgba(248, 249, 250, 0.95); /* 95% overlay (subtle background) */
    background: rgba(248, 249, 250, 0.85); /* 85% overlay (more visible) */
    background: rgba(248, 249, 250, 0.70); /* 70% overlay (very visible) */
}
```

### Change Number of Visible Slides

**CSS (style.css or styles.scss):**
```css
.inner-circle-videos__slide {
    /* Desktop: Show 3 slides */
    flex: 0 0 calc(33.333% - 20px);
    min-width: calc(33.333% - 20px);
}

@media (max-width: 1024px) {
    .inner-circle-videos__slide {
        /* Tablet: Show 2 slides */
        flex: 0 0 calc(50% - 15px);
        min-width: calc(50% - 15px);
    }
}
```

## Troubleshooting

### Videos Not Playing
1. Check video URL format is correct
2. Ensure video is publicly accessible
3. For YouTube: Check video is not age-restricted or private
4. For Vimeo: Check video privacy settings

### Slider Not Looping
1. Ensure you have at least 2 videos added
2. Check browser console for JavaScript errors
3. Clear browser cache and reload

### Images Not Displaying
1. Check image URLs are accessible
2. Verify image dimensions meet minimum requirements
3. Check WordPress media library permissions

### Styling Issues
1. Clear browser cache
2. Check for CSS conflicts with theme
3. Verify SCSS is compiling correctly (Next.js)
4. Check browser developer tools for CSS errors

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ iOS Safari (latest)
- ✅ Chrome Mobile (latest)

## Performance Tips

1. **Optimize Images**: Use WebP format, compress images
2. **Lazy Loading**: Thumbnails use lazy loading by default
3. **Video Hosting**: Use YouTube/Vimeo for better performance
4. **Limit Videos**: 5-10 videos recommended for optimal performance

## Next Steps

1. **Test in WordPress**: Add the block to a page and test functionality
2. **Add Content**: Upload team member photos and videos
3. **Customize**: Adjust colors and spacing to match your brand
4. **Deploy**: Test on staging before production

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Ensure ACF Pro is installed and activated
4. Check WordPress and Next.js are running latest versions

---

**Created**: February 27, 2026
**Version**: 1.0.0
