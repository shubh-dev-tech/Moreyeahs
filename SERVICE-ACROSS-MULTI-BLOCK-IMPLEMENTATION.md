# Service Across Multi Block - Implementation Guide

## Overview

A fully dynamic ACF block for showcasing multi-cloud services with comprehensive customization options. This block displays cloud platforms, service categories, technology badges, and testimonial quotes with a modern, animated design.

## Block Name

**Block Identifier:** `service-across-multi-block`  
**Block Title:** Service Across Multi Block  
**Category:** Formatting  
**Icon:** Cloud

## Features

✅ **Fully Dynamic Content** - All fields are editable through ACF  
✅ **No Conflicts** - Unique class names and IDs prevent conflicts  
✅ **Responsive Design** - Mobile-optimized with breakpoints  
✅ **Accessibility** - ARIA labels, keyboard navigation, reduced motion support  
✅ **GraphQL Ready** - All fields exposed for headless WordPress  
✅ **Animated Elements** - Smooth transitions and decorative animations  
✅ **Custom Styling** - Background and text color customization  

## File Structure

```
wp-content/themes/twentytwentyfive/
├── blocks/service-across-multi-block/
│   ├── block.php              # Main template file
│   ├── style.css              # Block styles
│   ├── script.js              # Interactive features
│   └── README.md              # Block documentation
├── acf-json/
│   └── group_service_across_multi_block.json  # ACF field definitions
└── inc/
    └── acf-blocks.php         # Block registration (updated)
```

## ACF Field Groups

### Main Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `main_heading` | Text | Yes | Primary heading text |
| `main_description` | Textarea | Yes | Descriptive text below heading |
| `background_color` | Color Picker | No | Section background color (default: #0f172a) |
| `text_color` | Color Picker | No | Text color (default: #ffffff) |

### Cloud Platforms (Repeater)

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `platform_icon` | Image | No | Platform logo/icon |
| `platform_name` | Text | Yes | Platform display name |

**Example Values:**
- Google Cloud Platform (GCP)
- Amazon Web Services (AWS)
- Microsoft Azure

### Service Categories (Repeater)

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `category_title` | Text | Yes | Category heading |
| `services` | Repeater | No | List of services |
| └─ `service_name` | Text | Yes | Individual service name |

**Example Categories:**
1. Core Cloud Services
2. Security & Data
3. AI, DevOps & Monitoring

### Technology Badges (Repeater)

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `tech_name` | Text | Yes | Technology name |
| `tech_color` | Color Picker | No | Badge background color (default: #1e3a8a) |

**Example Technologies:**
- GKE, AKS, EKS
- Docker, Terraform, IaC
- Prometheus, Grafana, ELK Stack
- Cloud Load Balancer, Big Data, Cloud Storage

### Additional Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `implementations_title` | Text | No | Technologies section heading (default: "Implementations & Technologies") |
| `testimonial_quote` | Textarea | No | Quote text for testimonial section |

## CSS Class Names

All class names use the `samb-` prefix (Service Across Multi Block) to prevent conflicts:

- `.service-across-multi-block` - Main container
- `.samb-container` - Content wrapper
- `.samb-header` - Header section
- `.samb-main-heading` - Main heading
- `.samb-main-description` - Main description
- `.samb-platforms` - Platforms section
- `.samb-platform-badge` - Individual platform badge
- `.samb-platform-icon` - Platform icon
- `.samb-platform-name` - Platform name
- `.samb-services` - Services section
- `.samb-services-grid` - Services grid container
- `.samb-service-category` - Service category card
- `.samb-category-title` - Category heading
- `.samb-services-list` - Services list
- `.samb-service-item` - Individual service item
- `.samb-service-checkmark` - Checkmark icon
- `.samb-service-name` - Service name
- `.samb-implementations` - Technologies section
- `.samb-implementations-title` - Technologies heading
- `.samb-tech-badges` - Technology badges container
- `.samb-tech-badge` - Individual technology badge
- `.samb-testimonial` - Testimonial section
- `.samb-quote` - Quote text
- `.samb-decorative-elements` - Decorative elements container
- `.samb-circle` - Decorative circles
- `.samb-line` - Decorative lines

## JavaScript Features

The block includes interactive JavaScript features:

1. **Scroll Animations** - Elements fade in on scroll using Intersection Observer
2. **Hover Effects** - Enhanced hover interactions for badges and cards
3. **Ripple Effect** - Click ripple animation on technology badges
4. **Accessibility** - ARIA labels and keyboard navigation
5. **Responsive Handling** - Adjustments on window resize
6. **Reduced Motion Support** - Respects user preferences

## Usage Instructions

### 1. Add Block to Page

1. Edit a page or post in WordPress
2. Click the "+" button to add a block
3. Search for "Service Across Multi Block"
4. Click to add the block

### 2. Configure Main Content

1. Enter the main heading (e.g., "Delivering Seamless Services Across Multi-Cloud Platforms")
2. Add the main description text
3. Optionally customize background and text colors

### 3. Add Cloud Platforms

1. Click "Add Platform" button
2. Upload platform icon (optional)
3. Enter platform name
4. Repeat for each platform (GCP, AWS, Azure, etc.)

### 4. Create Service Categories

1. Click "Add Category" button
2. Enter category title (e.g., "Core Cloud Services")
3. Click "Add Service" to add services to this category
4. Enter service names
5. Repeat for additional categories

### 5. Add Technology Badges

1. Click "Add Technology" button
2. Enter technology name
3. Choose badge color (optional)
4. Repeat for all technologies

### 6. Set Testimonial Quote

1. Enter the testimonial quote text
2. The quote will display with decorative quotation marks

### 7. Preview and Publish

1. Preview the block in the editor
2. Adjust any settings as needed
3. Publish or update the page

## Design Specifications

### Colors

- **Default Background:** `#0f172a` (Dark blue-gray)
- **Default Text:** `#ffffff` (White)
- **Checkmark Color:** `#10b981` (Green)
- **Border Color:** `rgba(255, 255, 255, 0.1)` (Transparent white)
- **Hover Background:** `rgba(255, 255, 255, 0.15)` (Lighter transparent white)

### Typography

- **Main Heading:** 2.5rem - 4rem (responsive), font-weight: 700
- **Main Description:** 1.25rem, line-height: 1.6
- **Category Title:** 1.5rem, font-weight: 700
- **Service Item:** 1rem, line-height: 1.5
- **Quote:** 1.5rem - 2.5rem (responsive), font-style: italic

### Spacing

- **Section Padding:** 80px vertical (60px on mobile)
- **Container Max Width:** 1200px
- **Grid Gap:** 40px (24px on mobile)
- **Card Padding:** 32px (24px on mobile)

### Animations

- **Float Animation:** 6s ease-in-out infinite
- **Pulse Animation:** 4s ease-in-out infinite
- **Hover Transitions:** 0.3s ease
- **Scroll Fade-in:** 0.6s ease with staggered delays

## Responsive Breakpoints

- **Desktop:** > 768px
- **Tablet:** 481px - 768px
- **Mobile:** ≤ 480px

### Mobile Optimizations

- Single column layout for service categories
- Reduced font sizes
- Smaller padding and gaps
- Hidden decorative elements for performance
- Simplified animations

## Accessibility Features

- **ARIA Labels:** All interactive elements have descriptive labels
- **Keyboard Navigation:** Tab navigation and Enter/Space key support
- **Reduced Motion:** Respects `prefers-reduced-motion` setting
- **High Contrast:** Enhanced borders and backgrounds in high contrast mode
- **Semantic HTML:** Proper heading hierarchy and list structures
- **Alt Text:** Image alt attributes for screen readers

## GraphQL Support

All fields are exposed to GraphQL with camelCase naming:

```graphql
{
  page(id: "page-id") {
    blocks {
      ... on AcfServiceAcrossMultiBlock {
        mainHeading
        mainDescription
        backgroundColor
        textColor
        cloudPlatforms {
          platformIcon {
            url
            alt
          }
          platformName
        }
        serviceCategories {
          categoryTitle
          services {
            serviceName
          }
        }
        implementationsTitle
        technologyBadges {
          techName
          techColor
        }
        testimonialQuote
      }
    }
  }
}
```

## Browser Support

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Features:** Grid, Flexbox, Custom Properties, Backdrop Filter
- **JavaScript:** ES6+ with graceful degradation
- **Fallbacks:** Basic layout for older browsers

## Performance Considerations

- **CSS-Only Animations:** Most animations use CSS for better performance
- **Lazy Loading:** Images use native lazy loading
- **Minimal JavaScript:** Only essential interactivity
- **Optimized Selectors:** Efficient CSS selectors
- **Mobile Optimization:** Reduced animations on mobile devices

## Conflict Prevention

### Unique Identifiers

- **Block ID:** `service-across-multi-{block-id}`
- **Class Prefix:** `samb-` for all classes
- **Field Keys:** `field_sam_*` for all ACF fields
- **Field Group Key:** `group_service_across_multi_block`

### No Conflicts With

- Other ACF blocks in the theme
- WordPress core blocks
- Third-party plugins
- Existing page sections

## Testing Checklist

- [ ] Block appears in block inserter
- [ ] All fields save correctly
- [ ] Preview mode displays properly
- [ ] Published page renders correctly
- [ ] Responsive design works on mobile
- [ ] Hover effects function properly
- [ ] Scroll animations trigger correctly
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] GraphQL queries return data
- [ ] No console errors
- [ ] No conflicts with other blocks

## Troubleshooting

### Block Not Appearing

1. Ensure ACF Pro is installed and activated
2. Check that the ACF JSON file is in the correct location
3. Verify the block is registered in `acf-blocks.php`
4. Clear WordPress cache

### Styles Not Loading

1. Check that `style.css` exists in the block folder
2. Verify the path in `acf-blocks.php` is correct
3. Clear browser cache
4. Check for CSS conflicts in browser dev tools

### JavaScript Not Working

1. Ensure `script.js` is enqueued in `acf-blocks.php`
2. Check browser console for errors
3. Verify JavaScript is not blocked by plugins
4. Test with browser dev tools

### Fields Not Saving

1. Check ACF field group is active
2. Verify field keys are unique
3. Check WordPress permissions
4. Review PHP error logs

## Customization

### Changing Colors

Edit the default values in `block.php`:

```php
$background_color = get_field('background_color') ?: '#0f172a';
$text_color = get_field('text_color') ?: '#ffffff';
```

### Modifying Animations

Edit animation keyframes in `style.css`:

```css
@keyframes float {
    /* Customize animation */
}
```

### Adding New Fields

1. Update ACF JSON file
2. Add field handling in `block.php`
3. Add styles in `style.css`
4. Update documentation

## Support

For issues or questions:

1. Check this documentation
2. Review ACF documentation
3. Check WordPress debug logs
4. Test in a clean environment

## Version History

- **v1.0.0** - Initial implementation with full dynamic fields and responsive design

## Credits

- **Design:** Based on multi-cloud services showcase pattern
- **Development:** Custom ACF block implementation
- **Icons:** Platform-specific logos (user-provided)
- **Animations:** CSS3 animations with accessibility support