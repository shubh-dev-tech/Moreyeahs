# Careers Custom Post Type - ACF Field Setup Guide

## Overview
This guide explains how to set up ACF (Advanced Custom Fields) for the Careers custom post type in WordPress, following the same pattern as the Case Study implementation.

## Post Type Registration
The careers post type has been registered in `wp-content/themes/twentytwentyfive-child/functions.php` with:
- Post type slug: `careers`
- REST API base: `careers`
- Menu icon: `dashicons-groups`
- Supports: title, editor, thumbnail, excerpt, custom-fields, revisions

## Taxonomies
Three custom taxonomies have been created:
1. **career_department** - For job departments (Engineering, Product, Design, etc.)
2. **career_type** - For job types (Full-time, Part-time, Remote, etc.)
3. **career_level** - For experience levels (Intern, Fresher, Experienced, etc.)

## ACF Field Groups

### Field Group: Career Details
**Location Rule:** Post Type is equal to Careers

#### Fields Structure:

```
Career Details
├── Background Image (Image)
│   └── Field Name: background_image
│   └── Return Format: Image Array
│   └── Preview Size: Medium
│
├── Job Type (Text)
│   └── Field Name: job_type
│   └── Example: "Full Time", "Part Time"
│
├── Department (Text)
│   └── Field Name: department
│   └── Example: "Engineering", "Marketing", "Sales"
│
├── Location / Job Preference (Text)
│   └── Field Name: location
│   └── Example: "On-Site", "Remote", "Hybrid"
│
├── Experience Level (Text)
│   └── Field Name: experience_level
│   └── Example: "Intern", "Fresher", "Experienced"
│
└── Job Sections (Repeater)
    └── Field Name: job_sections
    └── Layout: Block
    └── Sub Fields:
        ├── Section Heading (Text)
        │   └── Field Name: section_heading
        │   └── Example: "Overview", "Responsibilities", "Requirements", "What We Offer"
        │
        └── Section Content (Repeater)
            └── Field Name: section_content
            └── Layout: Block
            └── Sub Fields:
                ├── Paragraph (Textarea)
                │   └── Field Name: paragraph
                │   └── Rows: 4
                │
                └── Bullet Points (Repeater)
                    └── Field Name: bullet_points
                    └── Layout: Table
                    └── Sub Fields:
                        └── Bullet Text (Text)
                            └── Field Name: bullet_text
```

## Detailed Field Configuration

### 1. Background Image
- **Field Type:** Image
- **Field Name:** `background_image`
- **Return Format:** Image Array
- **Preview Size:** Medium
- **Instructions:** Upload a background image for the job detail page header

### 2. Job Type
- **Field Type:** Text
- **Field Name:** `job_type`
- **Instructions:** Enter the job type (e.g., Full-time, Part-time, Remote)

### 3. Department
- **Field Type:** Text
- **Field Name:** `department`
- **Instructions:** Enter the department (e.g., Engineering, Product, Design)

### 4. Location / Job Preference
- **Field Type:** Text
- **Field Name:** `location`
- **Instructions:** Enter the job location/preference (e.g., On-Site, Remote, Hybrid)

### 5. Experience Level
- **Field Type:** Text
- **Field Name:** `experience_level`
- **Instructions:** Enter the experience level (e.g., Intern, Fresher, Experienced)

### 6. Job Sections (Repeater)
- **Field Type:** Repeater
- **Field Name:** `job_sections`
- **Button Label:** Add Section
- **Layout:** Block
- **Instructions:** Add job sections like Overview, Responsibilities, Requirements, etc.

#### 5.1 Section Heading
- **Field Type:** Text
- **Field Name:** `section_heading`
- **Instructions:** Enter the section heading (e.g., "Overview", "Responsibilities")

#### 5.2 Section Content (Nested Repeater)
- **Field Type:** Repeater
- **Field Name:** `section_content`
- **Button Label:** Add Content Block
- **Layout:** Block
- **Instructions:** Add paragraphs and bullet points for this section

##### 5.2.1 Paragraph
- **Field Type:** Textarea
- **Field Name:** `paragraph`
- **Rows:** 4
- **Instructions:** Enter a paragraph of text

##### 5.2.2 Bullet Points (Nested Repeater)
- **Field Type:** Repeater
- **Field Name:** `bullet_points`
- **Button Label:** Add Bullet Point
- **Layout:** Table
- **Instructions:** Add bullet points for this content block

###### 5.2.2.1 Bullet Text
- **Field Type:** Text
- **Field Name:** `bullet_text`
- **Instructions:** Enter the bullet point text

## Example Data Structure

Here's an example of how the data should be structured for a "Full Stack Developer" position:

```json
{
  "background_image": {
    "url": "https://dev.moreyeahs.com/wp-content/uploads/2026/02/Group-1000001836.webp",
    "alt": "Career Background"
  },
  "job_type": "Full Time",
  "department": "Engineering",
  "location": "Remote",
  "experience_level": "Experienced",
  "job_sections": [
    {
      "section_heading": "Overview",
      "section_content": [
        {
          "paragraph": "We are looking for an experienced Full Stack Developer to join our Engineering team and contribute to the design, development, and delivery of innovative software solutions. In this role, you will work across the full stack building intuitive front-end experiences and website back-end services while collaborating closely with Product, Design, and other engineering teams.",
          "bullet_points": []
        },
        {
          "paragraph": "You will be involved in every part of the product lifecycle, from understanding requirements and proposing technical solutions to implementing, testing, and supporting features in production. This position is ideal for someone who enjoys ownership, values clean and maintainable code, and is comfortable working in a collaborative, fast-moving environment.",
          "bullet_points": []
        }
      ]
    },
    {
      "section_heading": "Responsibilities",
      "section_content": [
        {
          "paragraph": "",
          "bullet_points": [
            { "bullet_text": "Develop and maintain front-end applications using React." },
            { "bullet_text": "Build and support back-end services and APIs with Node.js." },
            { "bullet_text": "Collaborate cross-functionally to translate requirements into technical solutions." },
            { "bullet_text": "Write clean, maintainable, and well-tested code." },
            { "bullet_text": "Debug, optimize, and improve application performance." },
            { "bullet_text": "Participate in code reviews and engineering best practices." },
            { "bullet_text": "Support deployment and ongoing maintenance of production systems." }
          ]
        }
      ]
    },
    {
      "section_heading": "Requirements",
      "section_content": [
        {
          "paragraph": "",
          "bullet_points": [
            { "bullet_text": "3+ years of experience with React and Node.js." },
            { "bullet_text": "Strong understanding of TypeScript and state management." },
            { "bullet_text": "Experience with PostgreSQL and/or MongoDB." },
            { "bullet_text": "Solid knowledge of RESTful APIs." },
            { "bullet_text": "Familiarity with Git and modern development workflows." },
            { "bullet_text": "Ability to work independently and communicate effectively." }
          ]
        }
      ]
    },
    {
      "section_heading": "What We Offer",
      "section_content": [
        {
          "paragraph": "",
          "bullet_points": [
            { "bullet_text": "Competitive compensation" },
            { "bullet_text": "Flexible work environment" },
            { "bullet_text": "Opportunity to work on meaningful, production-scale products" },
            { "bullet_text": "Collaborative and supportive engineering culture" }
          ]
        }
      ]
    }
  ]
}
```

## REST API Exposure

The ACF fields are automatically exposed to the REST API through the function `add_acf_to_careers_rest()` in functions.php. The fields will be available at:

```
GET /wp-json/wp/v2/careers
GET /wp-json/wp/v2/careers/{id}
GET /wp-json/wp/v2/careers?slug={slug}
```

The ACF fields will be in the `acf_fields` property of the response.

## Frontend Implementation

The Next.js frontend has been set up with:

1. **Listing Page:** `/careers` - Shows all job openings with filters
2. **Detail Page:** `/careers/[slug]` - Shows individual job details with application form

### Components Created:
- `CareersWithSidebar.tsx` - Main listing page with sidebar filters
- `CareerDetailPage.tsx` - Individual job detail page with application form

## Testing the Setup

1. In WordPress admin, go to Careers > Add New
2. Fill in the title (e.g., "Full Stack Developer")
3. Add the ACF fields:
   - Upload a background image
   - Set job type, department, location
   - Add job sections (Overview, Responsibilities, Requirements, What We Offer)
   - For each section, add paragraphs and/or bullet points
4. Publish the career post
5. Visit `/careers` on your Next.js frontend to see the listing
6. Click on the job to see the detail page

## Notes

- The background image defaults to: `https://dev.moreyeahs.com/wp-content/uploads/2026/02/Group-1000001836.webp`
- The repeater structure allows flexible content with mixed paragraphs and bullet points
- The sidebar filters on the listing page work with the taxonomy terms and ACF fields
- The application form on the detail page is a client-side form (you'll need to add backend submission logic)

## Flush Permalinks

After adding the custom post type, make sure to flush permalinks:
1. Go to Settings > Permalinks in WordPress admin
2. Click "Save Changes" (no need to change anything)
3. This will regenerate the rewrite rules and make the careers URLs work properly
