# Case Study Implementation Guide

This document outlines the complete implementation of a dynamic, editor-friendly Case Study system using WordPress ACF Pro blocks and NextJS components.

## Overview

The Case Study system is built with:
- **WordPress Backend**: Custom Post Type with ACF Pro blocks
- **NextJS Frontend**: React components that mirror the WordPress blocks
- **100% Dynamic**: No hardcoded content, fully editor-controlled
- **SEO-Friendly**: Proper meta tags, structured data, and URLs
- **Responsive**: Mobile-first design approach

## WordPress Implementation

### 1. Custom Post Type Registration

**File**: `wp-content/themes/twentytwentyfive-child/functions.php`

- **Post Type**: `case_study`
- **Slug**: `case-study`
- **Features**: Gutenberg enabled, REST API support, archive page
- **Template**: Pre-configured with Case Study blocks

### 2. ACF Pro Blocks

#### Case Study Header Block (`acf/case-study-header`)
- **Purpose**: Hero section with gradient background, logo, title, and subtitle
- **Fields**:
  - Logo (Image)
  - Title (Text)
  - Subtitle (Text)
  - Background Image (Image)
  - Gradient Overlay (True/False)
  - Gradient Colors (Color Group)

#### Case Study Layout Block (`acf/case-study-layout`)
- **Purpose**: Main container with sidebar and content area
- **Fields**:
  - Enable Sidebar (True/False)
  - Sidebar Width (Text)
  - Content Gap (Text)
  - Container Max Width (Text)
- **Features**: Uses InnerBlocks for dynamic content

#### Case Study Left Sidebar Block (`acf/case-study-left-sidebar`)
- **Purpose**: Sticky sidebar with repeater sections
- **Key Features**:
  - **Repeater Field**: `sidebar_sections`
    - Section Icon (Image)
    - Section Title (Text)
    - **Inner Repeater**: `section_items`
      - Item Label (Text)
      - Item Value (Text)
  - Download Buttons (Repeater)
  - Customizable colors

**Example Usage**:
```
Our Client
├── Haseet Sanghrajka → CEO

Profile  
├── Location → London
├── Size → 5MB
├── Sector → IT Consultancy

Focus Areas
├── Document Management
├── Internet
├── Policy Management

Technology
├── Dynamics 365 Sales
├── Dynamics 365 Project
├── Power Platform
├── Power Automate
├── Power BI
├── SharePoint
```

#### Meet the Client Block (`acf/meet-the-client`)
- **Purpose**: Client profile with image, details, and optional quote
- **Fields**:
  - Section Title (Text)
  - Client Image (Image)
  - Client Name (Text)
  - Client Designation (Text)
  - Client Company (Text)
  - Client Content (WYSIWYG)
  - Client Quote (Textarea)
  - Icon Settings

#### Case Study Content Section Block (`acf/case-study-content-section`)
- **Purpose**: Reusable content block for different sections
- **Predefined Types**:
  - The Challenges
  - The Solution
  - The Partner
  - The Approach
  - Technology & Innovation
  - The Outcome
  - Efficiency Benefits
  - Lessons Learned and Future Plans
- **Fields**:
  - Enable Section (True/False)
  - Section Type (Select)
  - Section Title (Text)
  - Section Icon (Image)
  - Section Content (WYSIWYG)
  - Bullet Points (Repeater)
  - Section Quote (Textarea)
  - Show Divider (True/False)
  - Icon Color (Color Picker)

#### Case Study Quote Block (`acf/case-study-quote`)
- **Purpose**: Standalone quote with custom styling
- **Fields**:
  - Quote Text (Textarea)
  - Quote Author (Text)
  - Quote Position (Text)
  - Quote Company (Text)
  - Background Color (Color Picker)
  - Text Color (Color Picker)
  - Quote Style (Select: Gradient/Solid)
  - Show Quotation Marks (True/False)

#### Case Study CTA Block (`acf/case-study-cta`)
- **Purpose**: Call-to-action section with multiple buttons
- **Fields**:
  - **CTA Buttons (Repeater)**:
    - Button Text (Text)
    - Button URL (URL)
    - Button Style (Select: Primary/Secondary/Outline/Ghost)
    - Button Size (Select: Small/Medium/Large)
    - Button Icon (Image)
    - Open in New Tab (True/False)
    - Custom Colors (Color Pickers)
  - Section Background Color (Color Picker)
  - CTA Alignment (Select: Left/Center/Right)
  - Show Divider (True/False)

### 3. Template Files

#### Single Case Study Template
**File**: `wp-content/themes/twentytwentyfive-child/single-case_study.php`
- Clean template that renders Gutenberg blocks
- No hardcoded content

#### Archive Template
**File**: `wp-content/themes/twentytwentyfive-child/archive-case_study.php`
- Grid layout for case study listings
- Featured images and excerpts
- Responsive design

### 4. REST API Endpoints

Custom endpoints for NextJS integration:
- `GET /wp-json/wp/v2/case-studies` - List all case studies
- `GET /wp-json/wp/v2/case-studies/{slug}` - Single case study with ACF fields

## NextJS Implementation

### 1. Component Structure

**Location**: `nextjs-wordpress/src/components/case-study/`

#### Core Components

1. **CaseStudyHeader.tsx**
   - Mirrors WordPress header block
   - Gradient backgrounds with blend modes
   - Responsive logo and text layout

2. **CaseStudyLayout.tsx**
   - Main layout container
   - Sticky sidebar functionality
   - Responsive breakpoints

3. **CaseStudyLeftSidebar.tsx**
   - Dynamic sections from repeater fields
   - Download buttons
   - Customizable styling

4. **MeetTheClient.tsx**
   - Client profile display
   - Rich text content support
   - Optional quote styling

5. **CaseStudyContentSection.tsx**
   - Reusable content sections
   - Predefined section types with icons
   - Bullet points and quotes support

6. **CaseStudyQuote.tsx**
   - Standalone quote component
   - Gradient/solid background options
   - Attribution support

7. **CaseStudyCTA.tsx**
   - Multiple button support
   - Various button styles and sizes
   - Flexible alignment options

8. **CaseStudyPage.tsx**
   - Main page component
   - Block parser and renderer
   - Fallback layout for non-block content

### 2. Dynamic Pages

#### Single Case Study Page
**File**: `nextjs-wordpress/src/app/case-study/[slug]/page.tsx`
- Dynamic routing with slug parameter
- SEO metadata generation
- Static generation support
- Error handling with 404 fallback

#### Case Studies Archive
**File**: `nextjs-wordpress/src/app/case-studies/page.tsx`
- Grid layout for case study listings
- Server-side data fetching
- Responsive card design
- SEO optimization

### 3. TypeScript Interfaces

```typescript
interface CaseStudyData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featured_image?: string;
  acf_fields?: {
    [key: string]: any;
  };
}

interface CaseStudyBlock {
  blockName: string;
  attrs: {
    [key: string]: any;
  };
  innerBlocks?: CaseStudyBlock[];
  innerHTML: string;
  innerContent: string[];
}
```

## Key Features

### 1. 100% Dynamic Content
- No hardcoded text or images
- All content managed through WordPress editor
- Flexible field structure with repeaters

### 2. Editor-Friendly Interface
- Clear field labels and instructions
- Conditional logic for relevant fields
- Organized with tabs and groups
- Preview mode in Gutenberg

### 3. Reusable Architecture
- Modular block system
- Consistent styling patterns
- Scalable component structure

### 4. SEO Optimization
- Proper meta tags and Open Graph
- Structured URLs (`/case-study/slug`)
- Archive page for listings
- Image optimization

### 5. Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interactions

### 6. Performance Optimized
- Static generation support
- Image optimization with Next.js
- Efficient data fetching
- CSS-in-JS for component isolation

## Usage Instructions

### For Editors

1. **Create New Case Study**:
   - Go to WordPress Admin → Case Studies → Add New
   - Add title and featured image
   - Use the pre-configured block template

2. **Configure Header**:
   - Upload company logo
   - Set title and subtitle
   - Choose gradient colors
   - Optional background image

3. **Set Up Sidebar**:
   - Click "Add Section" to create new sidebar sections
   - Add section title (e.g., "Our Client", "Profile")
   - Click "Add Item" to add label-value pairs
   - Configure download buttons if needed

4. **Add Content Sections**:
   - Choose from predefined section types or create custom
   - Add rich text content
   - Include bullet points for key information
   - Add quotes for emphasis

5. **Customize Styling**:
   - Adjust colors for icons and backgrounds
   - Enable/disable sections as needed
   - Control dividers and spacing

### For Developers

1. **Extending Blocks**:
   - Add new fields to ACF JSON files
   - Update corresponding React components
   - Maintain TypeScript interfaces

2. **Custom Section Types**:
   - Add new options to section type select field
   - Update predefined configurations in components
   - Add corresponding icons and colors

3. **Styling Customization**:
   - Modify CSS-in-JS styles in components
   - Update responsive breakpoints
   - Customize color schemes

## File Structure

```
WordPress Theme:
├── functions.php (CPT registration, blocks, REST API)
├── single-case_study.php (Single template)
├── archive-case_study.php (Archive template)
├── blocks/
│   ├── case-study-header/
│   ├── case-study-layout/
│   ├── case-study-left-sidebar/
│   ├── meet-the-client/
│   ├── case-study-content-section/
│   ├── case-study-quote/
│   └── case-study-cta/
└── acf-json/ (Field group definitions)

NextJS App:
├── src/app/
│   ├── case-study/[slug]/page.tsx
│   └── case-studies/page.tsx
└── src/components/case-study/
    ├── CaseStudyHeader.tsx
    ├── CaseStudyLayout.tsx
    ├── CaseStudyLeftSidebar.tsx
    ├── MeetTheClient.tsx
    ├── CaseStudyContentSection.tsx
    ├── CaseStudyQuote.tsx
    ├── CaseStudyCTA.tsx
    ├── CaseStudyPage.tsx
    └── index.ts
```

## Deployment Notes

1. **WordPress Setup**:
   - Ensure ACF Pro is installed and activated
   - Import ACF field groups from JSON files
   - Configure permalink structure for case studies

2. **NextJS Setup**:
   - Set WordPress URL in environment variables
   - Configure image domains in next.config.js
   - Set up revalidation intervals for data fetching

3. **Production Considerations**:
   - Enable static generation for better performance
   - Set up proper caching strategies
   - Configure CDN for images and assets
   - Monitor API response times

This implementation provides a complete, scalable solution for case study management that's both editor-friendly and developer-maintainable.