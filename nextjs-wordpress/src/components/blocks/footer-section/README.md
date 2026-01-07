# Footer Section Block

A dynamic, fully customizable footer component that matches your design requirements exactly. This footer can be managed through WordPress ACF fields or used as a standalone React component.

## Features

- **100% Design Match**: Recreates the exact layout and styling from your reference image
- **Fully Dynamic**: All content is manageable through WordPress ACF fields
- **Responsive Design**: Adapts perfectly to all screen sizes
- **Social Media Integration**: Built-in support for LinkedIn, Twitter, Facebook, Instagram, and YouTube
- **Customizable Styling**: Colors, fonts, and spacing can be adjusted through ACF fields
- **SEO Friendly**: Proper semantic HTML structure
- **Accessibility Compliant**: ARIA labels and keyboard navigation support

## WordPress Usage

### 1. Add the Footer Block

In your WordPress admin:
1. Go to any page/post editor
2. Click the "+" button to add a block
3. Search for "Footer Section"
4. Add the block to your page

### 2. Configure the Footer

The block provides these customization options:

#### Branding
- **Logo**: Upload your company logo
- **Company Description**: Brief description about your company

#### Navigation Columns
- **Company Links**: Add links like "About us", "Case Study", "Blog"
- **About Links**: Add links like "About Us", "Culture"
- **Career Links**: Add links like "Apply Now"
- **Services Links**: Add links like "Data Science & AI", "DevOps", etc.

#### Social Media
- **Social Links**: Add your social media profiles
- **Follow Us Text**: Customize the social section heading

#### Legal & Copyright
- **Copyright Text**: Customize the copyright notice
- **Privacy Policy Link**: Add link to privacy policy
- **Terms of Use Link**: Add link to terms of use

#### Styling
- **Background Color**: Set the footer background color
- **Text Color**: Set the main text color
- **Link Color**: Set the link color
- **Link Hover Color**: Set the link hover color

## Next.js Usage

### 1. Import the Component

```tsx
import { FooterSection } from '@/components/blocks/footer-section';
```

### 2. Use with Data

```tsx
const footerData = {
  logo: {
    url: '/images/logo.png',
    alt: 'Company Logo'
  },
  company_description: 'Your company description here...',
  company_columns: [
    {
      title: '',
      links: [
        { label: 'About us', url: '/about' },
        { label: 'Case Study', url: '/case-studies' },
        { label: 'Blog', url: '/blog' }
      ]
    }
  ],
  // ... more configuration
};

<FooterSection data={footerData} />
```

### 3. Demo Component

Use the included demo component to see the footer in action:

```tsx
import FooterDemo from '@/components/blocks/footer-section/FooterDemo';

<FooterDemo />
```

## Data Structure

### FooterLink
```typescript
interface FooterLink {
  label: string;
  url: string;
  target?: '_blank' | '_self';
}
```

### FooterColumn
```typescript
interface FooterColumn {
  title: string;
  links: FooterLink[];
}
```

### SocialLink
```typescript
interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'youtube';
  url: string;
}
```

### Complete Data Interface
```typescript
interface FooterSectionProps {
  data?: {
    logo?: {
      url: string;
      alt: string;
    };
    company_description?: string;
    company_columns?: FooterColumn[];
    about_columns?: FooterColumn[];
    career_columns?: FooterColumn[];
    services_columns?: FooterColumn[];
    social_links?: SocialLink[];
    follow_us_text?: string;
    copyright_text?: string;
    privacy_policy_link?: FooterLink;
    terms_of_use_link?: FooterLink;
    background_color?: string;
    text_color?: string;
    link_color?: string;
    link_hover_color?: string;
  };
}
```

## Styling

The footer uses SCSS for styling with these key features:

- **CSS Grid Layout**: Responsive grid that adapts to different screen sizes
- **CSS Custom Properties**: For dynamic color theming
- **Mobile-First Design**: Responsive breakpoints for optimal mobile experience
- **Hover Effects**: Smooth transitions for interactive elements
- **Dark Theme Support**: Built-in support for dark theme variants

### Responsive Breakpoints

- **Desktop (1200px+)**: 6-column grid layout
- **Tablet (768px-1024px)**: 3-column grid layout
- **Mobile (< 768px)**: Single column layout

## Customization

### Adding New Social Platforms

To add new social platforms, update the `socialIcons` object in `FooterSection.tsx`:

```tsx
const socialIcons = {
  // existing icons...
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      {/* TikTok SVG path */}
    </svg>
  )
};
```

### Custom Styling

Override styles by targeting the CSS classes:

```scss
.footer-section {
  // Custom styles here
  
  .footer-brand {
    // Logo and description styles
  }
  
  .footer-column {
    // Column styles
  }
  
  .social-links {
    // Social media styles
  }
}
```

## Integration with WordPress

The footer integrates seamlessly with WordPress through:

1. **ACF Block Registration**: Registered as a custom ACF block
2. **REST API Support**: Data accessible via WordPress REST API
3. **Theme Integration**: Works with any WordPress theme
4. **Widget Support**: Can be used in widget areas

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance

- **Optimized Images**: Uses Next.js Image component for optimal loading
- **CSS Grid**: Modern layout without JavaScript dependencies
- **Minimal JavaScript**: Only client-side code for interactivity
- **Tree Shaking**: Only imports used components

## Accessibility

- **Semantic HTML**: Proper footer, nav, and list structures
- **ARIA Labels**: Screen reader friendly social links
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant color combinations

## Support

For issues or questions:
1. Check the demo component for reference implementation
2. Verify ACF fields are properly configured
3. Ensure all required dependencies are installed
4. Check browser console for any JavaScript errors