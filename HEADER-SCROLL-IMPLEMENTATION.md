# Header Scroll Hide/Show Implementation

This implementation provides a smooth hide/show effect for the header menu when scrolling, with the menu hiding when scrolling down and appearing when scrolling up or at the top of the page.

## Files Created/Modified

### 1. Core JavaScript Implementation
- `nextjs-wordpress/src/utils/headerScroll.js` - Vanilla JavaScript implementation
- `nextjs-wordpress/src/hooks/useHeaderScroll.ts` - React hook for Next.js
- `nextjs-wordpress/src/hooks/useAdvancedHeaderScroll.ts` - Advanced hook with customization options

### 2. Styles
- `nextjs-wordpress/src/styles/components/_header.scss` - Updated with scroll animations
- `nextjs-wordpress/src/styles/components/_header-scroll-alternative.scss` - CSS-only alternative approach

### 3. Component Integration
- `nextjs-wordpress/src/components/HeaderWithMegaMenu.tsx` - Updated to use the scroll hook

### 4. Test Files
- `test-header-scroll-behavior.html` - Standalone HTML test file

## How It Works

### Scroll Detection
- Monitors scroll position and direction using `requestAnimationFrame` for smooth performance
- Only triggers after scrolling more than 5px to avoid jitter
- Uses throttling to optimize performance

### Animation States
1. **At Top (0-100px)**: Menu always visible, no background
2. **Scrolling Down (>100px)**: Menu hides with smooth upward animation, background appears
3. **Scrolling Up**: Menu shows with smooth downward animation, background remains

### CSS Classes Applied
- `.header--scrolled`: Applied when scrolled past threshold (adds background/shadow)
- `.header__menu--hidden`: Applied to hide the menu (transforms up and fades out)

## Usage

### Basic Implementation (React/Next.js)
```tsx
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function Header() {
  useHeaderScroll(); // Initialize scroll behavior
  
  return (
    <header className="header">
      <nav className="header__nav">
        <div className="header__logo">Logo</div>
        <ul className="header__menu">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
  );
}
```

### Advanced Implementation with Options
```tsx
import { useAdvancedHeaderScroll } from '@/hooks/useAdvancedHeaderScroll';

export default function Header() {
  const { isHidden, isScrolled } = useAdvancedHeaderScroll({
    hideThreshold: 150,        // Start hiding after 150px
    scrollDelta: 10,           // Require 10px scroll to trigger
    animationDuration: 400,    // 400ms animation
    onStateChange: (hidden, scrolled) => {
      console.log('Header state:', { hidden, scrolled });
    }
  });
  
  return (
    <header className="header">
      {/* Your header content */}
    </header>
  );
}
```

### Vanilla JavaScript Implementation
```html
<script src="path/to/headerScroll.js"></script>
<script>
  // Auto-initializes when DOM is ready
  // Or manually initialize:
  // initHeaderScroll();
</script>
```

## Customization Options

### CSS Variables
```scss
:root {
  --header-animation-duration: 0.3s; // Animation speed
}
```

### Advanced Hook Options
- `hideThreshold`: Scroll distance before hiding starts (default: 100px)
- `scrollDelta`: Minimum scroll movement to trigger (default: 5px)
- `animationDuration`: Animation duration in milliseconds (default: 300ms)
- `headerSelector`: Custom header element selector (default: '.header')
- `menuSelector`: Custom menu element selector (default: '.header__menu')
- `onStateChange`: Callback function for state changes

## Browser Support

### JavaScript Implementation
- All modern browsers
- IE11+ (with polyfills for `requestAnimationFrame`)

### CSS-Only Implementation (Experimental)
- Chrome 115+
- Firefox 110+
- Safari 16.4+
- Requires `animation-timeline: scroll()` support

## Performance Considerations

1. **Throttled Scroll Events**: Uses `requestAnimationFrame` for optimal performance
2. **Passive Event Listeners**: Scroll events are passive for better scrolling performance
3. **Minimal DOM Queries**: Elements are queried once and cached
4. **CSS Transforms**: Uses `transform` and `opacity` for hardware-accelerated animations

## Testing

Open `test-header-scroll-behavior.html` in a browser to see the effect in action:
1. Scroll down to see the menu hide smoothly
2. Scroll up to see the menu appear
3. At the very top, the menu is always visible

## Troubleshooting

### Menu Not Hiding
- Ensure `.header` and `.header__menu` classes exist
- Check that the scroll threshold is appropriate for your content
- Verify JavaScript is loading and executing

### Jerky Animation
- Increase `scrollDelta` to require more scroll movement
- Check for conflicting CSS transitions
- Ensure `transform` and `opacity` are hardware-accelerated

### Performance Issues
- Reduce animation frequency by increasing `scrollDelta`
- Check for other scroll event listeners that might conflict
- Consider using the CSS-only approach for supported browsers

## Future Enhancements

1. **Intersection Observer**: Could be used for more complex visibility detection
2. **Reduced Motion**: Respect `prefers-reduced-motion` media query
3. **Touch Gestures**: Enhanced mobile scroll detection
4. **Multiple Headers**: Support for multiple header instances