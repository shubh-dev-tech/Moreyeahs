# Service Across Multi Block

A comprehensive ACF block for showcasing multi-cloud services with dynamic content management.

## Features

- **Dynamic Main Content**: Customizable heading and description
- **Cloud Platforms**: Repeatable platform badges with icons and names
- **Service Categories**: Organized service sections with checkmark lists
- **Technology Badges**: Flexible technology showcase with custom colors
- **Testimonial Quote**: Prominent quote section with styling
- **Custom Styling**: Background and text color customization
- **Responsive Design**: Mobile-optimized layout
- **Accessibility**: High contrast and reduced motion support

## Block Structure

### Main Fields
- `main_heading` - Primary heading text
- `main_description` - Descriptive text below heading
- `background_color` - Section background color
- `text_color` - Text color for the section

### Cloud Platforms (Repeater)
- `platform_icon` - Platform logo/icon image
- `platform_name` - Platform display name

### Service Categories (Repeater)
- `category_title` - Category heading
- `services` (Sub-repeater)
  - `service_name` - Individual service name

### Technology Badges (Repeater)
- `tech_name` - Technology name
- `tech_color` - Badge background color

### Additional Fields
- `implementations_title` - Technologies section heading
- `testimonial_quote` - Quote text for testimonial section

## Usage

1. Add the "Service Across Multi Block" to your page/post
2. Configure the main heading and description
3. Add cloud platforms with their respective icons
4. Create service categories and add services to each
5. Add technology badges with custom colors
6. Set testimonial quote
7. Customize colors as needed

## Styling

The block includes comprehensive CSS with:
- Gradient backgrounds and glass-morphism effects
- Hover animations and transitions
- Responsive breakpoints
- Accessibility considerations
- Decorative animated elements

## File Structure

```
blocks/service-across-multi-block/
├── block.php          # Main template file
├── style.css          # Block styles
└── README.md          # This documentation
```

## ACF Field Configuration

The block uses the ACF field group `group_service_across_multi_block` with GraphQL support enabled for headless implementations.

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Graceful degradation for older browsers
- Reduced motion and high contrast mode support

## Performance

- Optimized CSS with minimal animations on mobile
- Lazy loading for images
- Efficient DOM structure
- Minimal JavaScript dependencies (CSS-only animations)