# Careers Feature - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [File Structure](#file-structure)
5. [ACF Field Setup](#acf-field-setup)
6. [Usage Guide](#usage-guide)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

## 🎯 Overview

This careers feature is a complete job board implementation for WordPress + Next.js, following the same architecture pattern as the case_study custom post type. It includes:

- **WordPress Backend**: Custom post type with ACF fields
- **Next.js Frontend**: Listing and detail pages with filters
- **Responsive Design**: Mobile-first approach
- **Application Form**: Built-in job application form
- **Flexible Content**: Repeater fields for dynamic sections

### Key Features
✅ Custom post type: `careers`  
✅ Three taxonomies: department, type, level  
✅ ACF repeater fields for flexible content  
✅ Sidebar filters on listing page  
✅ Application form on detail page  
✅ Responsive design  
✅ SEO-friendly with metadata  
✅ REST API enabled  

## 🚀 Quick Start

### 1. WordPress Setup (5 minutes)

```bash
# 1. Flush permalinks
WordPress Admin > Settings > Permalinks > Save Changes

# 2. Verify careers menu appears in admin sidebar

# 3. Create ACF field group (see QUICK_START_CAREERS.md)
```

### 2. Create Your First Job (10 minutes)

```bash
# 1. Go to Careers > Add New
# 2. Title: "Full Stack Developer - Engineering"
# 3. Fill in ACF fields:
#    - Background Image: Upload or use default
#    - Job Type: "Engineering"
#    - Department: "Engineering"
#    - Location: "Remote"
#    - Job Sections: Add Overview, Responsibilities, Requirements, What We Offer
# 4. Publish
```

### 3. View on Frontend

```bash
# Visit your Next.js site:
http://localhost:3000/careers          # Listing page
http://localhost:3000/careers/[slug]   # Detail page
```

## 🏗️ Architecture

### Data Flow

```
WordPress (Backend)
    ↓
Custom Post Type: careers
    ↓
ACF Fields (job_sections, etc.)
    ↓
REST API: /wp-json/wp/v2/careers
    ↓
Next.js (Frontend)
    ↓
Pages: /careers, /careers/[slug]
    ↓
Components: CareersWithSidebar, CareerDetailPage
    ↓
User Interface
```

### Technology Stack

**Backend:**
- WordPress 6.x
- ACF Pro (or Free)
- Custom Post Types
- REST API

**Frontend:**
- Next.js 13+ (App Router)
- React 18+
- TypeScript
- CSS Modules

## 📁 File Structure

```
moreyeahs-new/
├── wp-content/themes/twentytwentyfive-child/
│   ├── functions.php                          # Post type registration
│   └── acf-careers-fields-template.php        # ACF field template
│
├── nextjs-wordpress/
│   ├── src/
│   │   ├── app/
│   │   │   └── careers/
│   │   │       ├── page.tsx                   # Listing page
│   │   │       ├── page.module.css            # Listing styles
│   │   │       └── [slug]/
│   │   │           ├── page.tsx               # Detail page
│   │   │           └── not-found.tsx          # 404 page
│   │   │
│   │   └── components/
│   │       └── careers/
│   │           ├── CareersWithSidebar.tsx     # Listing component
│   │           ├── CareersWithSidebar.module.css
│   │           ├── CareerDetailPage.tsx       # Detail component
│   │           ├── CareerDetailPage.module.css
│   │           └── index.ts                   # Exports & types
│   │
│   └── ...
│
└── Documentation/
    ├── README_CAREERS.md                      # This file
    ├── QUICK_START_CAREERS.md                 # Quick setup guide
    ├── CAREERS_ACF_SETUP.md                   # Detailed ACF guide
    ├── CAREERS_IMPLEMENTATION_SUMMARY.md      # Implementation details
    └── CAREERS_CHECKLIST.md                   # Testing checklist
```

## 🔧 ACF Field Setup

### Field Group: Career Details

```
Career Details (Field Group)
│
├── background_image (Image)
│   └── Return Format: Image Array
│
├── job_type (Text)
│   └── e.g., "Engineering", "Product"
│
├── department (Text)
│   └── e.g., "Engineering", "Design"
│
├── location (Text)
│   └── e.g., "Remote", "Hybrid"
│
└── job_sections (Repeater)
    │
    ├── section_heading (Text)
    │   └── e.g., "Overview", "Responsibilities"
    │
    └── section_content (Repeater)
        │
        ├── paragraph (Textarea)
        │   └── Optional paragraph text
        │
        └── bullet_points (Repeater)
            └── bullet_text (Text)
                └── Individual bullet point
```

### Location Rule
- **Post Type** is equal to **Careers**

### Quick Setup
See `QUICK_START_CAREERS.md` for step-by-step ACF field creation.

## 📖 Usage Guide

### Creating a New Job Posting

1. **Go to Careers > Add New**

2. **Enter Job Title**
   ```
   Example: "Full Stack Developer - Engineering"
   ```

3. **Fill in Basic Fields**
   - Job Type: "Engineering"
   - Department: "Engineering"
   - Location: "Remote"
   - Background Image: Upload or leave empty for default

4. **Add Job Sections**

   **Section 1: Overview**
   - Section Heading: "Overview"
   - Add Content Block:
     - Paragraph: Write job overview
     - Bullet Points: (optional)

   **Section 2: Responsibilities**
   - Section Heading: "Responsibilities"
   - Add Content Block:
     - Paragraph: (leave empty)
     - Bullet Points:
       - "Develop and maintain applications"
       - "Collaborate with team members"
       - etc.

   **Section 3: Requirements**
   - Section Heading: "Requirements"
   - Add Content Block:
     - Paragraph: (leave empty)
     - Bullet Points:
       - "3+ years experience"
       - "Strong knowledge of React"
       - etc.

   **Section 4: What We Offer**
   - Section Heading: "What We Offer"
   - Add Content Block:
     - Paragraph: (leave empty)
     - Bullet Points:
       - "Competitive compensation"
       - "Flexible work environment"
       - etc.

5. **Publish**

### Viewing Jobs on Frontend

**Listing Page:** `/careers`
- Shows all published jobs
- Sidebar filters
- Job cards with metadata

**Detail Page:** `/careers/[slug]`
- Full job description
- All sections with content
- Application form sidebar

### Using Filters

The listing page includes filters for:
- **Experience Level**: Intern, Fresher, Experienced
- **Department**: Based on your job posts
- **Job Type**: Based on your job posts
- **Job Preference**: On-Site, Remote, Hybrid

Filters update the job count and displayed jobs in real-time.

## 🎨 Customization

### Changing Colors

Edit the CSS module files:

**Listing Page Colors:**
```css
/* nextjs-wordpress/src/app/careers/page.module.css */
.careers-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change gradient colors here */
}
```

**Detail Page Colors:**
```css
/* nextjs-wordpress/src/components/careers/CareerDetailPage.module.css */
.submitButton {
  background: #667eea;
  /* Change button color here */
}
```

### Modifying Form Fields

Edit `CareerDetailPage.tsx`:

```typescript
// Add a new field
<div className={styles.formGroup}>
  <label htmlFor="newField">New Field *</label>
  <input
    type="text"
    id="newField"
    name="newField"
    value={formData.newField}
    onChange={handleInputChange}
    required
  />
</div>
```

### Adding New ACF Fields

1. Add field in WordPress ACF
2. Update TypeScript interface in `index.ts`:

```typescript
export interface CareerData {
  // ... existing fields
  acf_fields?: {
    // ... existing fields
    new_field?: string;  // Add your new field
  };
}
```

3. Use in component:

```typescript
const newField = acf.new_field;
```

### Changing Default Background Image

Edit `CareerDetailPage.tsx`:

```typescript
const backgroundImage = acf.background_image?.url || 'YOUR_NEW_DEFAULT_URL';
```

## 🐛 Troubleshooting

### Issue: Careers menu not showing in WordPress

**Solution:**
```bash
1. Go to Settings > Permalinks
2. Click "Save Changes"
3. Refresh WordPress admin
```

### Issue: ACF fields not appearing

**Solution:**
- Verify ACF plugin is active
- Check Location Rule: Post Type = Careers
- Verify field names match code

### Issue: Jobs not showing on frontend

**Solution:**
```bash
1. Check REST API: /wp-json/wp/v2/careers
2. Verify jobs are published (not draft)
3. Check browser console for errors
4. Restart Next.js dev server
```

### Issue: 404 on career detail pages

**Solution:**
```bash
1. Flush permalinks in WordPress
2. Restart Next.js: npm run dev
3. Clear browser cache
```

### Issue: Filters not working

**Solution:**
- Verify ACF field names match component code
- Check that jobs have filter fields filled in
- Open browser console to check for errors

### Issue: Form not submitting

**Note:** Form submission is not implemented by default. You need to:
1. Create an API route in Next.js
2. Add form submission logic
3. Handle email/database storage

## 📡 API Reference

### REST API Endpoints

**List All Careers**
```
GET /wp-json/wp/v2/careers
```

**Single Career by ID**
```
GET /wp-json/wp/v2/careers/{id}
```

**Single Career by Slug**
```
GET /wp-json/wp/v2/careers?slug={slug}
```

**With ACF Fields**
```
GET /wp-json/wp/v2/careers?acf_format=standard
```

**Filter by Department**
```
GET /wp-json/wp/v2/careers?career_department={term_id}
```

### Response Structure

```json
{
  "id": 123,
  "title": {
    "rendered": "Full Stack Developer"
  },
  "slug": "full-stack-developer",
  "excerpt": {
    "rendered": "<p>Job excerpt...</p>"
  },
  "acf_fields": {
    "background_image": {
      "url": "https://...",
      "alt": "Background"
    },
    "job_type": "Engineering",
    "department": "Engineering",
    "location": "Remote",
    "job_sections": [
      {
        "section_heading": "Overview",
        "section_content": [
          {
            "paragraph": "Job description...",
            "bullet_points": [
              {
                "bullet_text": "Bullet point 1"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 📚 Additional Resources

- **Quick Start Guide**: `QUICK_START_CAREERS.md`
- **ACF Setup Guide**: `CAREERS_ACF_SETUP.md`
- **Implementation Details**: `CAREERS_IMPLEMENTATION_SUMMARY.md`
- **Testing Checklist**: `CAREERS_CHECKLIST.md`

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check browser console for errors
4. Verify WordPress REST API is working

## 📝 License

This implementation follows the same license as your WordPress theme and Next.js application.

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Compatible With:** WordPress 6.x, Next.js 13+, ACF 6.x
