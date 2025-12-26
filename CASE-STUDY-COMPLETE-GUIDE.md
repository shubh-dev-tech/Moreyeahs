# Case Study Custom Post Type - Complete Implementation Guide

## Overview

This implementation provides a fully dynamic, block-based Case Study system for WordPress with ACF Pro blocks and Next.js support. The design matches the City Dynamics case study layout with a left sidebar and right content area.

---

## Features

### ✅ Custom Post Type
- **Slug:** `case-study`
- **REST API:** Enabled (`/wp-json/wp/v2/case-studies/`)
- **Gutenberg:** Fully enabled
- **Archive Page:** Available at `/case-studies/`
- **SEO-Friendly:** Full meta support

### ✅ ACF Pro Blocks Architecture
All blocks are 100% dynamic and editor-friendly:

1. **Case Study Header** - Gradient header with logo, title, subtitle
2. **Case Study Layout** - Main container with sidebar and content area
3. **Left Sidebar** - Repeater-based sections (Our Client, Profile, Focus Areas, Technology)
4. **Meet the Client** - Right-aligned client profile block
5. **Content Sections** - Reusable blocks for:
   - The Challenges
   - The Solution
   - The Partner
   - The Approach
   - Technology & Innovation
   - The Outcome
   - Efficiency Benefits
   - Lessons Learned
6. **Quote Block** - Standalone quote with author
7. **CTA Block** - Call-to-action section

---

## WordPress Setup

### File Structure

```
wp-content/themes/twentytwentyfive-child/
├── acf-json/
│   ├── group_case_study_header.json
│   ├── group_case_study_layout.json
│   ├── group_case_study_left_sidebar.json
│   ├── group_meet_the_client.json
│   ├── group_case_study_content_section.json
│   ├── group_case_study_quote.json
│   └── group_case_study_cta.json
├── blocks/
│   ├── case-study-header/
│   │   ├── block.php
│   │   └── style.css
│   ├── case-study-layout/
│   ├── case-study-left-sidebar/
│   ├── meet-the-client/
│   ├── case-study-content-section/
│   ├── case-study-quote/
│   └── case-study-cta/
├── assets/
│   └── css/
│       └── case-study.css
├── single-case_study.php
├── archive-case_study.php
└── functions.php
```

### Required Plugins
- **Advanced Custom Fields (ACF) Pro** - For block creation

### Steps to Activate

1. **Activate ACF Pro** if not already active
2. **Save Permalinks** (Settings → Permalinks → Save Changes)
3. **Sync ACF Fields** (ACF → Tools → Sync Available)
4. **Create New Case Study** (Case Studies → Add New)

---

## Creating a Case Study (Editor Guide)

### Step 1: Add Case Study Header

1. Click **+** button in the editor
2. Search for **"Case Study Header"** block
3. Fill in the fields:
   - **Logo:** Upload client logo
   - **Title:** Enter main title (e.g., "City Dynamics")
   - **Subtitle:** Enter subtitle (e.g., "Transforming Collaboration...")
   - **Background Image:** (Optional) Upload background
   - **Gradient Colors:** Customize gradient overlay

### Step 2: Add Case Study Layout

1. Add **"Case Study Layout"** block
2. This creates the two-column structure automatically

### Step 3: Add Left Sidebar (Inside Layout)

1. Inside the Layout block, add **"Case Study Left Sidebar"**
2. Click **"Add Section"** to create sections:

   **Example: Our Client Section**
   - Section Icon: Upload icon (optional)
   - Section Title: "Our Client"
   - Click **"Add Item"**:
     - Label: (Leave blank or "Name")
     - Value: "Haseet Sanghrajka"
   - Add another item:
     - Label: "Designation"
     - Value: "CEO"

   **Example: Profile Section**
   - Section Title: "Profile"
   - Items:
     - Location: "London"
     - Sector: "IT Consultancy"

   **Example: Technology Section**
   - Section Title: "Technology"
   - Items:
     - Dynamics 365 Project Operations
     - Power Automate
     - Power BI
     - Microsoft Teams
     - SharePoint

### Step 4: Add Content Blocks (Inside Layout)

**Meet the Client Block:**
1. Add **"Meet the Client"** block
2. Fill in:
   - Section Title: "Meet the Client"
   - Client Image: Upload photo
   - Client Name: "Haseet Sanghrajka"
   - Client Designation: "CEO"
   - Client Company: "City Dynamics"
   - Client Content: Add rich text content
   - Client Quote: (Optional) Add quote

**Content Section Blocks:**
Add **"Case Study Content Section"** blocks for each section:

1. **The Challenges**
   - Section Type: Select "challenges"
   - Section Title: Auto-filled or customize
   - Section Content: Add WYSIWYG content
   - Bullet Points: Click "Add Bullet" for each point
   - Section Quote: (Optional) Add highlighted quote
   - Show Divider: Enable/Disable

2. **The Solution**
   - Section Type: Select "solution"
   - Fill remaining fields similarly

3. **The Partner**
   - Section Type: Select "partner"

4. **The Approach**
   - Section Type: Select "approach"

5. **Technology & Innovation**
   - Section Type: Select "technology"

6. **The Outcome**
   - Section Type: Select "outcome"

7. **Efficiency Benefits**
   - Section Type: Select "efficiency"

8. **Lessons Learned**
   - Section Type: Select "lessons"

### Step 5: Add CTA (Optional)

1. Add **"Case Study CTA"** block at the bottom
2. Configure buttons and text

---

## Next.js Integration

### File Structure

```
nextjs-wordpress/
└── src/
    ├── app/
    │   └── case-study/
    │       └── [slug]/
    │           └── page.tsx
    └── components/
        └── case-study/
            ├── index.ts
            ├── CaseStudyPage.tsx
            ├── CaseStudyHeader.tsx
            ├── CaseStudyLayout.tsx
            ├── CaseStudyLeftSidebar.tsx
            ├── MeetTheClient.tsx
            ├── CaseStudyContentSection.tsx
            ├── CaseStudyQuote.tsx
            └── CaseStudyCTA.tsx
```

### API Endpoints

**List All Case Studies:**
```
GET /wp-json/wp/v2/case-studies
```

**Single Case Study:**
```
GET /wp-json/wp/v2/case-studies/{slug}
```

Response includes:
- `id` - Post ID
- `title` - Case study title
- `slug` - URL slug
- `content` - Raw content
- `blocks` - Parsed Gutenberg blocks
- `acf_fields` - All ACF field data
- `excerpt` - Excerpt
- `date` - Publish date
- `featured_image` - Featured image URL

### Usage in Next.js

```typescript
// Fetch single case study
const caseStudy = await fetch(
  `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/case-studies/city-dynamics`
);

// Render with component
import CaseStudyPage from '@/components/case-study/CaseStudyPage';

<CaseStudyPage caseStudy={caseStudy} />
```

---

## Styling

### WordPress Styles
All styles are in:
```
/wp-content/themes/twentytwentyfive-child/assets/css/case-study.css
```

Automatically enqueued on:
- Single case study pages (`single-case_study.php`)
- Case study archive (`archive-case_study.php`)

### Next.js Styles
Import the CSS file in your Next.js component or add to global styles.

### Color Scheme
Default colors match the City Dynamics design:
- **Primary:** `#e91e63` (Pink)
- **Gradient 1:** `#00bcd4` (Cyan)
- **Gradient 2:** `#9c27b0` (Purple)

Customize in ACF fields or CSS variables.

---

## Advanced Features

### Repeater Fields
The Left Sidebar uses nested repeaters:
```
Sidebar Sections (Repeater)
└── Section Items (Nested Repeater)
    ├── Item Label
    └── Item Value
```

This allows unlimited sections and items.

### Conditional Logic
- Gradient overlay shows/hides color picker
- Enable/Disable sections without deleting content
- Show/hide various elements dynamically

### Icon Selectors
All blocks support custom icons via image upload or default SVG icons.

### REST API Fields
All ACF fields are automatically exposed to the REST API via:
```php
'acf_fields' => function_exists('get_fields') ? get_fields($post->ID) : []
```

---

## Customization

### Adding New Section Types

1. **Edit Block PHP:**
   ```php
   // In case-study-content-section/block.php
   $section_configs = array(
       'your-type' => array(
           'title' => 'Your Section Title',
           'default_icon' => '<svg>...</svg>'
       )
   );
   ```

2. **Update ACF Field:**
   Add new choice to `section_type` select field

### Changing Layout Width

Edit in **Case Study Layout** block settings:
- Sidebar Width (default: 350px)
- Container Max Width (default: 1400px)
- Content Gap (default: 40px)

### Custom CSS Classes

All blocks support custom CSS classes via the "Additional CSS Class" field in block settings.

---

## Troubleshooting

### Issue: Blocks not showing in editor
**Solution:**
1. Go to ACF → Tools
2. Click "Sync Available"
3. Sync all case study field groups

### Issue: Single page not rendering
**Solution:**
1. Check if `single-case_study.php` exists
2. Save Permalinks (Settings → Permalinks → Save)
3. Clear cache if using caching plugin

### Issue: REST API returns 404
**Solution:**
1. Save Permalinks
2. Check if post type slug matches (`case_study`)
3. Verify `show_in_rest` is true

### Issue: Styles not loading
**Solution:**
1. Check if CSS file exists at:
   `/wp-content/themes/twentytwentyfive-child/assets/css/case-study.css`
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Next.js not fetching data
**Solution:**
1. Verify `NEXT_PUBLIC_WORDPRESS_URL` in `.env.local`
2. Check CORS settings in WordPress
3. Test API endpoint directly in browser

---

## Performance Optimization

### WordPress
- ✅ CSS only loads on case study pages
- ✅ Minimal inline styles
- ✅ Optimized block rendering
- ✅ Proper image lazy loading

### Next.js
- ✅ Static generation with `generateStaticParams`
- ✅ Revalidation every 60 seconds
- ✅ Optimized image components
- ✅ Code splitting per component

---

## SEO Features

- ✅ Clean URL structure (`/case-study/city-dynamics/`)
- ✅ Meta title and description
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data ready
- ✅ Proper heading hierarchy
- ✅ Image alt tags

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Accessibility

- ✅ Semantic HTML5
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ Color contrast WCAG AA compliant
- ✅ Focus indicators

---

## Testing Checklist

### WordPress
- [ ] Create new case study
- [ ] Add all blocks
- [ ] Preview in editor
- [ ] Publish and view on frontend
- [ ] Test archive page
- [ ] Test mobile responsive
- [ ] Verify styles load correctly

### Next.js
- [ ] Fetch case studies list
- [ ] Fetch single case study
- [ ] Verify blocks render correctly
- [ ] Test responsive design
- [ ] Check build process
- [ ] Test static generation
- [ ] Verify API responses

---

## Support & Resources

### WordPress Codex
- [Register Post Type](https://developer.wordpress.org/reference/functions/register_post_type/)
- [ACF Blocks](https://www.advancedcustomfields.com/resources/blocks/)

### Next.js Documentation
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

### Project Files
All implementation files are located in:
- `/wp-content/themes/twentytwentyfive-child/`
- `/nextjs-wordpress/src/`

---

## Version History

**v1.0.0** - Initial Implementation
- Custom post type registration
- All ACF blocks created
- WordPress templates
- Next.js components
- Complete styling
- REST API support

---

## Credits

Design inspired by City Dynamics case study layout.
Built with ACF Pro, WordPress, and Next.js.

---

**End of Documentation**
