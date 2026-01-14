# FAQ Section Block

A dynamic FAQ (Frequently Asked Questions) section block with expandable accordion-style questions and answers.

## Features

- **Dynamic Content**: Add unlimited FAQ items through ACF repeater fields
- **Accordion Functionality**: Click to expand/collapse answers with smooth animations
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support
- **Customizable**: Easy to style and modify colors, fonts, and spacing
- **SEO Friendly**: Proper HTML structure with semantic markup

## Block Structure

### Fields

1. **Title** (Text)
   - Main heading for the FAQ section
   - Default: "Frequently Asked Questions"
   - Optional field

2. **FAQ Items** (Repeater)
   - **Question** (Text) - Required
   - **Answer** (WYSIWYG) - Required, supports rich text formatting

## Usage

1. Add the "FAQ Section" block to your page
2. Set the main title (optional)
3. Add FAQ items using the repeater field:
   - Enter the question text
   - Add the answer using the rich text editor
4. Publish/update the page

## Styling

The block includes comprehensive CSS with:
- Light blue gradient background matching the design
- Clean white cards with subtle shadows
- Smooth hover and transition effects
- Responsive breakpoints for mobile devices
- Proper focus states for accessibility

## JavaScript Functionality

- Accordion behavior: Only one FAQ can be open at a time
- Smooth expand/collapse animations
- Keyboard accessible
- ARIA attributes for screen readers
- Click anywhere on the question to toggle

## File Structure

```
blocks/faq-section/
├── block.php          # WordPress block template
├── style.css          # Block styles
└── README.md          # This documentation
```

## NextJS Integration

The block is also available in the NextJS frontend:

```
nextjs-wordpress/src/components/blocks/faq-section/
├── FaqSection.tsx     # React component
├── styles.scss        # SCSS styles
└── acf.json          # ACF field definitions
```

## Example Usage

The block automatically handles the accordion functionality and styling. Simply add questions and answers through the WordPress admin interface.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with graceful degradation)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features

- Proper ARIA labels and states
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Semantic HTML structure