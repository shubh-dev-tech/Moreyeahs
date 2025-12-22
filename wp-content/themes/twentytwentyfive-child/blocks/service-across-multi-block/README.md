# Service Across Multi Block

A dynamic ACF block for displaying multi-cloud service offerings with cloud platforms, service categories, technology badges, and testimonial quotes.

## Features

- **Main Heading & Description**: Customizable heading and description text
- **Cloud Platform Badges**: Display cloud provider logos (GCP, AWS, Azure, etc.)
- **Service Categories**: Organized service offerings with checkmark lists
- **Technology Badges**: Display implementation technologies with custom colors
- **Testimonial Quote**: Featured quote with decorative styling
- **Decorative Elements**: Animated circles, lines, and dots for visual appeal
- **Customizable Colors**: Background and text color options
- **Fully Responsive**: Mobile-optimized design

## ACF Fields

### Main Content
- **Main Heading** (text, required): Primary heading for the section
- **Main Description** (textarea, required): Description text below heading

### Cloud Platforms (repeater)
- **Platform Icon** (image): Logo/icon for the cloud platform
- **Platform Name** (text, required): Name of the platform (e.g., "Google Cloud Platform (GCP)")

### Service Categories (repeater)
- **Category Title** (text, required): Title for the service category
- **Services** (nested repeater):
  - **Service Name** (text, required): Individual service name

### Implementations & Technologies
- **Implementations Title** (text): Section title (default: "Implementations & Technologies")
- **Technology Badges** (repeater):
  - **Technology Name** (text, required): Name of the technology
  - **Badge Color** (color picker): Background color for the badge

### Testimonial
- **Testimonial Quote** (textarea): Quote text to display

### Styling
- **Background Color** (color picker): Section background color (default: #0f172a)
- **Text Color** (color picker): Text color (default: #ffffff)

## Usage in WordPress

1. Add the "Service Across Multi Block" to your page
2. Fill in the main heading and description
3. Add cloud platform badges with icons and names
4. Create service categories and add services to each
5. Add technology badges with custom colors
6. Add a testimonial quote
7. Customize colors as needed

## Usage in NextJS

The block is automatically rendered through the BlockRenderer component:

```tsx
import ServiceAcrossMultiBlock from '@/components/blocks/service-across-multi-block/ServiceAcrossMultiBlock';

<ServiceAcrossMultiBlock
  mainHeading="Delivering Seamless Services Across Multi-Cloud Platforms"
  mainDescription="We enable enterprises to design, deploy, and manage secure, scalable, and high-performance solutions across leading cloud providers."
  cloudPlatforms={[
    { platformName: "Google Cloud Platform (GCP)", platformIcon: { url: "/icon.png", alt: "GCP" } },
    { platformName: "Amazon Web Services (AWS)" },
    { platformName: "Microsoft Azure" }
  ]}
  serviceCategories={[
    {
      categoryTitle: "Core Cloud Services",
      services: [
        { serviceName: "Software, Platform & Infrastructure Services" },
        { serviceName: "Compute Services" },
        { serviceName: "Storage Services" },
        { serviceName: "Networking Services" }
      ]
    }
  ]}
  technologyBadges={[
    { techName: "GKE", techColor: "#1e3a8a" },
    { techName: "AKS", techColor: "#1e3a8a" },
    { techName: "Docker", techColor: "#2563eb" }
  ]}
  testimonialQuote="The best service is delivered when customer success becomes your own."
  backgroundColor="#0f172a"
  textColor="#ffffff"
/>
```

## Styling

The block includes:
- Glassmorphism effects on platform badges and service categories
- Animated decorative elements (circles, lines, dots)
- Hover effects on badges and technologies
- Responsive grid layouts
- Mobile-optimized typography

## Design Pattern

Based on modern multi-cloud service presentation with:
- Dark background with light text
- Semi-transparent containers with backdrop blur
- Animated background elements
- Clean, organized service categorization
- Technology badge showcase
- Prominent testimonial quote

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports CSS animations and backdrop-filter

## Version

1.0.0 - Initial release