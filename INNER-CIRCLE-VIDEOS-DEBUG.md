# Inner Circle Videos Block - Debugging Guide

## 🔍 Quick Debug Steps

### Step 1: Check WordPress
1. Go to WordPress admin → Pages → Life at MoreYeahs
2. Verify the "Inner Circle Videos" block is added
3. Check that videos are configured with:
   - Name
   - Job Title
   - Thumbnail image
   - Video URL
4. Click "Update" to save

### Step 2: Check Browser Console
1. Open the page: `/life-at-moreyeahs`
2. Open browser console (F12)
3. Look for these logs:
   ```
   InnerCircleVideosBlock mounted
   Data: {...}
   Videos: [...]
   Heading: "Inner Circle Videos"
   ```

### Step 3: Check Network Tab
1. Open Network tab in browser dev tools
2. Refresh the page
3. Look for API call to WordPress
4. Check response includes block data

### Step 4: Restart Next.js
```bash
# Stop the dev server (Ctrl+C)
cd nextjs-wordpress
rm -rf .next
npm run dev
```

### Step 5: Hard Refresh Browser
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Or clear browser cache

## 🐛 Common Issues & Solutions

### Issue: Block Not Showing

**Check 1: Is block added in WordPress?**
- Go to WordPress admin
- Edit the page
- Verify block is present

**Check 2: Are videos configured?**
- Block requires at least 1 video
- Each video needs all 4 fields filled

**Check 3: Check console for errors**
```javascript
// Should see this:
InnerCircleVideosBlock mounted
Data: { heading: "...", videos: [...] }

// If you see this, no videos configured:
InnerCircleVideosBlock: No videos provided
```

**Check 4: Verify block registration**
```typescript
// In BlockRenderer.tsx, should have:
'acf/inner-circle-videos': InnerCircleVideosBlock,
```

### Issue: Autoplay Not Working

**Check 1: Videos array**
```javascript
// Console should show:
Videos: [{ name: "...", title: "...", ... }]

// Not:
Videos: []
Videos: undefined
```

**Check 2: Component mounted**
```javascript
// Should see in console:
InnerCircleVideosBlock mounted
```

**Check 3: Slider ref**
- Autoplay needs DOM to be ready
- 100ms delay ensures slider is mounted

### Issue: Background Image Not Showing

**Check 1: Image uploaded**
- Verify image in WordPress media library
- Check ACF field has image selected

**Check 2: Console logs**
```javascript
// Should see:
Background Image: { url: "https://...", ... }

// Not:
Background Image: undefined
```

**Check 3: Image URL transformation**
- Check `transformMediaUrl` is imported
- Verify WordPress URL is accessible

## 📊 Expected Console Output

### Successful Load:
```
InnerCircleVideosBlock mounted
Data: {
  heading: "Inner Circle Videos",
  subheading: "Real stories...",
  videos: [
    { name: "Sarah Jenkins", title: "Project Manager", ... },
    { name: "David Chen", title: "Sales Manager", ... }
  ],
  background_image: { url: "https://...", ... }
}
Videos: (2) [{...}, {...}]
Heading: Inner Circle Videos
Background Image: {url: "https://...", alt: "..."}
```

### No Videos:
```
InnerCircleVideosBlock mounted
Data: { heading: "...", videos: [] }
Videos: []
InnerCircleVideosBlock: No videos provided
```

### Not Mounted (Block not rendering):
```
(No logs at all)
```
**Solution**: Check block is registered in BlockRenderer.tsx

## 🔧 Manual Testing Checklist

### WordPress Admin
- [ ] Block appears in block inserter
- [ ] Can add/edit heading
- [ ] Can add/edit subheading
- [ ] Can upload background image
- [ ] Can add videos
- [ ] Can upload thumbnails
- [ ] Can enter video URLs
- [ ] Changes save correctly

### Next.js Frontend
- [ ] Block renders on page
- [ ] Heading displays correctly
- [ ] Subheading displays correctly
- [ ] Background image shows (if set)
- [ ] Thumbnails load
- [ ] Slider shows 2 slides (desktop)
- [ ] Slider auto-advances every 5 seconds
- [ ] Can drag/swipe to navigate
- [ ] Pagination dots update
- [ ] Play button works
- [ ] Video opens in modal
- [ ] Modal closes properly
- [ ] Autoplay resumes after modal

### Autoplay Testing
1. Load page
2. Wait 5 seconds
3. Slider should advance automatically
4. Wait another 5 seconds
5. Should advance again
6. Drag slider manually
7. Wait 5 seconds
8. Should resume autoplay

### Infinite Loop Testing
1. Let slider autoplay through all videos
2. After last video, should seamlessly loop to first
3. No visible jump or break
4. Pagination dots should update correctly

## 🚨 Error Messages

### "No videos provided"
**Cause**: Videos array is empty or undefined
**Fix**: Add videos in WordPress admin

### "Module not found: @/lib/wordpress"
**Cause**: Import path incorrect
**Fix**: Verify import statement

### "transformMediaUrl is not a function"
**Cause**: Function not exported from module
**Fix**: Check import path and function name

### "Cannot read property 'url' of undefined"
**Cause**: Image object structure incorrect
**Fix**: Check ACF field returns proper object

## 📝 Debug Code Snippets

### Add to component for debugging:
```typescript
useEffect(() => {
  console.log('=== DEBUG START ===');
  console.log('Full data object:', data);
  console.log('Videos count:', videos?.length);
  console.log('First video:', videos?.[0]);
  console.log('Slider ref:', sliderRef.current);
  console.log('=== DEBUG END ===');
}, [data, videos]);
```

### Check if autoplay is running:
```typescript
useEffect(() => {
  console.log('Autoplay ref:', autoplayRef.current);
  console.log('Is autoplay running?', autoplayRef.current !== null);
}, [currentIndex]);
```

## 🎯 Quick Fixes

### Fix 1: Clear Everything
```bash
# Clear Next.js cache
cd nextjs-wordpress
rm -rf .next
rm -rf node_modules/.cache

# Restart
npm run dev
```

### Fix 2: Force Rebuild
```bash
cd nextjs-wordpress
npm run build
npm run dev
```

### Fix 3: Check WordPress API
Visit: `https://your-wordpress-site.com/wp-json/wp/v2/pages?slug=life-at-moreyeahs`

Should see block data in response.

---

**Last Updated**: February 27, 2026
**Status**: Ready for testing
