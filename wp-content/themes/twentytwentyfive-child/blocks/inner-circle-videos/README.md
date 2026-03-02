# Inner Circle Videos Block

A custom ACF block that displays team member videos in an infinite loop slider with video popup functionality.

## Features

- **Infinite Loop Slider**: Seamlessly loops through videos without visible breaks
- **Video Popup**: Click play button to open video in a modal overlay
- **Multiple Video Sources**: Supports YouTube, Vimeo, and direct MP4 links
- **Touch/Drag Support**: Swipe on mobile or drag on desktop to navigate
- **Autoplay**: Automatically advances every 5 seconds
- **Responsive Design**: Adapts to all screen sizes
- **Pagination Dots**: Visual indicators for current slide

## ACF Fields

### Main Fields
- **Heading** (Text): Main heading text (default: "Inner Circle Videos")
- **Subheading** (Text): Descriptive subheading text
- **Background Image** (Image, Optional): Background image for the section (recommended: 1920x1080px)

### Video Repeater
- **Name** (Text, Required): Team member name
- **Job Title** (Text, Required): Team member's position
- **Thumbnail Image** (Image, Required): Video thumbnail (recommended: 600x400px)
- **Video URL** (URL, Required): YouTube, Vimeo, or direct MP4 link

## Video URL Formats

### YouTube
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`

### Vimeo
- `https://vimeo.com/VIDEO_ID`

### Direct MP4
- `https://example.com/video.mp4`

## Usage

1. Add the "Inner Circle Videos" block in the WordPress editor
2. Enter heading and subheading text
3. Add team member videos:
   - Enter name and job title
   - Upload thumbnail image
   - Paste video URL
4. Add at least 2-3 videos for best slider effect

## Slider Behavior

- **Desktop**: Shows 2 slides at a time
- **Tablet**: Shows 1.5 slides at a time
- **Mobile**: Shows 1 slide at a time
- **Autoplay**: 5 seconds per slide
- **Infinite Loop**: Seamlessly loops by tripling the slides
- **Drag/Swipe**: Navigate by dragging or swiping

## Video Popup

- Click play button to open video in modal
- Video autoplays when modal opens
- Close with X button, overlay click, or Escape key
- Autoplay resumes after closing modal

## Customization

### Change Background Overlay Opacity

To make the background image more visible, adjust the overlay:

**CSS (style.css or styles.scss):**
```css
.inner-circle-videos::before {
    background: rgba(248, 249, 250, 0.85); /* Lower value = more visible background */
    /* 0.95 = 95% opacity (default)
       0.85 = 85% opacity (more visible)
       0.70 = 70% opacity (very visible) */
}
```

### CSS Variables
Edit `style.css` to customize:
- Colors and backgrounds
- Card border radius
- Shadow effects
- Spacing and gaps
- Animation timing

### JavaScript Settings
Edit `script.js` to adjust:
- Autoplay interval (default: 5000ms)
- Animation duration (default: 500ms)
- Drag sensitivity threshold

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for thumbnail images
- CSS transitions for smooth animations
- Efficient DOM manipulation
- Pauses autoplay when tab is hidden
- Responsive resize handling with debounce
