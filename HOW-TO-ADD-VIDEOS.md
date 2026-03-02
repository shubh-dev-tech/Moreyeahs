# How to Add Videos to Inner Circle Videos Block

## Step-by-Step Guide

### 1. Go to WordPress Admin
Navigate to: `http://localhost/moreyeahs-new/wp-admin`

### 2. Edit the Life at MoreYeahs Page
1. Go to **Pages** → **All Pages**
2. Find **"Life at MoreYeahs"** page
3. Click **Edit**

### 3. Add the Inner Circle Videos Block
1. Click the **"+"** button to add a block
2. Search for **"Inner Circle Videos"**
3. Click to add the block

### 4. Configure the Block

#### Main Settings:
- **Heading**: "Inner Circle Videos" (or customize)
- **Subheading**: "Real stories and insights straight from our team."
- **Background Image** (Optional): Upload a background image

#### Add Videos:
Click **"Add Video"** button for each team member

For each video, fill in:

1. **Name** (Required)
   - Example: "Sarah Jenkins"
   
2. **Job Title** (Required)
   - Example: "Project Manager"
   
3. **Thumbnail Image** (Required)
   - Click "Select Image" or "Upload"
   - Choose a photo of the team member
   - Recommended size: 600x400px
   - Formats: JPG, PNG, WebP
   
4. **Video URL** (Required)
   - Paste the video link
   - Supported formats:
     - YouTube: `https://www.youtube.com/watch?v=VIDEO_ID`
     - Vimeo: `https://vimeo.com/VIDEO_ID`
     - Direct MP4: `https://example.com/video.mp4`

### 5. Add Multiple Videos
- Click **"Add Video"** again to add more team members
- Recommended: Add at least 2-3 videos for best slider effect
- You can add as many as you want

### 6. Save the Page
1. Click **"Update"** button (top right)
2. Wait for "Page updated" confirmation

### 7. View on Frontend
1. Open: `http://localhost:3001/life-at-moreyeahs`
2. The block should now appear with your videos!

## Example Video Configuration

### Video 1:
- **Name**: Sarah Jenkins
- **Job Title**: Project Manager
- **Thumbnail**: Upload photo of Sarah
- **Video URL**: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

### Video 2:
- **Name**: David Chen
- **Job Title**: Sales Manager
- **Thumbnail**: Upload photo of David
- **Video URL**: `https://vimeo.com/123456789`

### Video 3:
- **Name**: Maria Garcia
- **Job Title**: Lead Developer
- **Thumbnail**: Upload photo of Maria
- **Video URL**: `https://example.com/videos/maria-interview.mp4`

## Troubleshooting

### Block Not Showing?
- Make sure you clicked "Update" to save the page
- Check that at least 1 video is configured
- Refresh the Next.js page (Ctrl+R)

### Videos Not Playing?
- **YouTube**: Make sure video is public (not private)
- **Vimeo**: Check privacy settings allow embedding
- **MP4**: Verify the file URL is accessible

### Thumbnails Not Loading?
- Check image is uploaded to WordPress media library
- Verify image URL is correct
- Try re-uploading the image

### "No videos configured" Message?
This means:
- No videos have been added yet, OR
- Videos were added but page wasn't saved, OR
- Next.js cache needs to be cleared

**Solution**: Add videos in WordPress and click "Update"

## Tips for Best Results

1. **Use High-Quality Images**
   - Minimum: 600x400px
   - Recommended: 800x600px
   - Keep file size under 200KB

2. **Keep Videos Short**
   - Ideal length: 1-3 minutes
   - Viewers prefer shorter, focused content

3. **Consistent Thumbnails**
   - Use same aspect ratio for all (4:3 or 16:9)
   - Similar lighting and style
   - Professional appearance

4. **Test Videos**
   - Make sure videos play before adding
   - Check audio quality
   - Verify video is public/accessible

5. **Add Multiple Videos**
   - Minimum: 2 videos
   - Recommended: 3-5 videos
   - Maximum: No limit, but 10-15 is optimal

## Video URL Examples

### YouTube:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
```

### Vimeo:
```
https://vimeo.com/123456789
https://vimeo.com/channels/staffpicks/123456789
```

### Direct MP4:
```
https://example.com/videos/team-interview.mp4
https://cdn.example.com/media/sarah-jenkins.mp4
```

## Need Help?

If you're still having issues:
1. Check browser console for errors (F12)
2. Verify WordPress block is saved
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server: `npm run dev`

---

**Ready to add your team videos!** 🎥
