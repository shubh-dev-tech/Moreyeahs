# Video Section Block

A customizable video section block with heading, sub-heading, video player, and custom button functionality.

## Features

- **Responsive Video Player**: Supports MP4, WebM, and MOV formats
- **Custom Thumbnail**: Optional video thumbnail/poster image
- **Heading & Sub-heading**: Customizable text content
- **Custom Button**: Configurable button with custom text and URL
- **Background Options**: Support for background color and background image
- **Play Overlay**: Custom play button overlay for better UX
- **Responsive Design**: Mobile-first responsive layout
- **Accessibility**: Full keyboard navigation and screen reader support

## ACF Fields

### Content Fields
- **Heading** (Text): Main heading for the video section
- **Sub Heading** (Text): Descriptive text below the heading
- **Video URL** (File): Upload video file (MP4, WebM, MOV)
- **Video Thumbnail** (Image): Optional poster image for video

### Button Fields
- **Button Text** (Text): Text to display on the button
- **Button URL** (URL): Optional URL for button link (if empty, button plays video)

### Styling Fields
- **Background Color** (Color Picker): Section background color
- **Background Image** (Image): Optional background image

## Usage

1. Add the "Video Section" block to your page
2. Upload a video file in the Video URL field
3. Add your heading and sub-heading text
4. Configure the button text and URL (optional)
5. Customize background color or image (optional)
6. Add a video thumbnail for better loading experience (optional)

## Design Features

- **Grid Layout**: Video on left, content on right (stacks on mobile)
- **Rounded Corners**: 20px border radius on video container
- **Shadow Effects**: Subtle drop shadows for depth
- **Smooth Animations**: Slide-in animations for content
- **Hover Effects**: Interactive button and play button states
- **Play Overlay**: Custom play button that disappears when video starts

## File Structure

```
blocks/video-section/
├── block.php          # WordPress block template
├── style.css          # WordPress/PHP styles
└── README.md          # This documentation

nextjs-wordpress/src/components/blocks/video-section/
├── VideoSectionBlock.tsx  # React component
└── styles.scss           # NextJS styles
```

## Browser Support

- Modern browsers with HTML5 video support
- Fallback messaging for unsupported browsers
- Progressive enhancement for advanced features

## Accessibility Features

- Proper ARIA labels for video controls
- Keyboard navigation support
- Focus indicators for interactive elements
- Screen reader compatible
- High contrast mode support