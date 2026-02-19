# Careers Implementation Checklist

Use this checklist to ensure the careers feature is fully set up and working.

## WordPress Backend Setup

### Post Type Registration
- [ ] Careers post type is registered in `functions.php`
- [ ] Careers menu appears in WordPress admin sidebar
- [ ] Careers post type has the groups icon (dashicons-groups)

### Taxonomies
- [ ] `career_department` taxonomy is registered
- [ ] `career_type` taxonomy is registered
- [ ] `career_level` taxonomy is registered
- [ ] Taxonomies appear in Careers admin menu

### Permalinks
- [ ] Visited Settings > Permalinks
- [ ] Clicked "Save Changes" to flush rewrite rules
- [ ] Can access `/careers/` URL without 404 error

### ACF Fields
- [ ] ACF plugin is installed and activated
- [ ] Created "Career Details" field group
- [ ] Added `background_image` field (Image)
- [ ] Added `job_type` field (Text)
- [ ] Added `department` field (Text)
- [ ] Added `location` field (Text)
- [ ] Added `job_sections` repeater field
  - [ ] Added `section_heading` sub-field (Text)
  - [ ] Added `section_content` nested repeater
    - [ ] Added `paragraph` sub-field (Textarea)
    - [ ] Added `bullet_points` nested repeater
      - [ ] Added `bullet_text` sub-field (Text)
- [ ] Set Location Rule: Post Type = Careers
- [ ] Published the field group

### REST API
- [ ] ACF fields are exposed to REST API
- [ ] Can access `/wp-json/wp/v2/careers` endpoint
- [ ] Response includes `acf_fields` property
- [ ] Test with: `curl https://your-site.com/wp-json/wp/v2/careers`

### Sample Content
- [ ] Created at least one test career post
- [ ] Filled in all ACF fields
- [ ] Added multiple job sections
- [ ] Added paragraphs and bullet points
- [ ] Published the career post

## Next.js Frontend Setup

### Files Created
- [ ] `nextjs-wordpress/src/app/careers/page.tsx` exists
- [ ] `nextjs-wordpress/src/app/careers/page.module.css` exists
- [ ] `nextjs-wordpress/src/app/careers/[slug]/page.tsx` exists
- [ ] `nextjs-wordpress/src/app/careers/[slug]/not-found.tsx` exists
- [ ] `nextjs-wordpress/src/components/careers/CareersWithSidebar.tsx` exists
- [ ] `nextjs-wordpress/src/components/careers/CareersWithSidebar.module.css` exists
- [ ] `nextjs-wordpress/src/components/careers/CareerDetailPage.tsx` exists
- [ ] `nextjs-wordpress/src/components/careers/CareerDetailPage.module.css` exists
- [ ] `nextjs-wordpress/src/components/careers/index.ts` exists

### Build & Run
- [ ] No TypeScript errors in careers files
- [ ] Next.js development server is running
- [ ] No console errors related to careers

### Listing Page (`/careers`)
- [ ] Page loads without errors
- [ ] Hero section displays with correct text
- [ ] Job listings appear
- [ ] Sidebar filters are visible
- [ ] Job count is displayed correctly
- [ ] Job cards show title, excerpt, and badges
- [ ] Clicking a job card navigates to detail page
- [ ] Page is responsive on mobile

### Detail Page (`/careers/[slug]`)
- [ ] Page loads without errors
- [ ] Background image displays (or default)
- [ ] Job title displays correctly
- [ ] Job metadata badges display
- [ ] All job sections render
- [ ] Paragraphs display correctly
- [ ] Bullet points display correctly
- [ ] Application form sidebar is visible
- [ ] All form fields are present:
  - [ ] Full Name
  - [ ] Email
  - [ ] Phone Number
  - [ ] Date of Birth
  - [ ] Resume/Portfolio upload
  - [ ] Submit button
- [ ] Page is responsive on mobile
- [ ] Sidebar becomes stacked on mobile

### Filters (Listing Page)
- [ ] Experience Level filter works
- [ ] Department filter works
- [ ] Job Type filter works
- [ ] Job Preference filter works
- [ ] Job count updates when filtering
- [ ] Correct jobs display after filtering
- [ ] "No results" message shows when no matches

### Error Handling
- [ ] Invalid career slug shows 404 page
- [ ] 404 page has "View All Open Positions" link
- [ ] 404 page has "Go Home" link
- [ ] Empty careers list shows appropriate message

## Testing Scenarios

### Test 1: Create and View Career
1. [ ] Create a new career in WordPress
2. [ ] Fill in all ACF fields
3. [ ] Publish the career
4. [ ] Visit `/careers` on frontend
5. [ ] Verify the new career appears
6. [ ] Click on the career
7. [ ] Verify all content displays correctly

### Test 2: Multiple Careers
1. [ ] Create 5+ careers with different departments
2. [ ] Visit `/careers`
3. [ ] Verify all careers appear
4. [ ] Test each filter option
5. [ ] Verify filtering works correctly

### Test 3: Responsive Design
1. [ ] Open `/careers` on desktop
2. [ ] Resize browser to mobile width
3. [ ] Verify layout adapts correctly
4. [ ] Open a career detail page
5. [ ] Verify detail page is responsive
6. [ ] Test on actual mobile device if possible

### Test 4: Form Interaction
1. [ ] Open a career detail page
2. [ ] Try to submit empty form
3. [ ] Verify required field validation
4. [ ] Fill in all fields
5. [ ] Try to upload a non-PDF file
6. [ ] Upload a PDF file
7. [ ] Submit the form
8. [ ] Check console for form data (currently logs to console)

### Test 5: SEO & Metadata
1. [ ] View page source of `/careers`
2. [ ] Verify meta tags are present
3. [ ] View page source of career detail page
4. [ ] Verify meta tags include job title
5. [ ] Test with SEO tools (optional)

## Performance Checks

- [ ] Careers listing page loads in < 3 seconds
- [ ] Career detail page loads in < 3 seconds
- [ ] Images are optimized (Next.js Image component)
- [ ] No console warnings or errors
- [ ] No memory leaks (check with React DevTools)

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Accessibility (Optional but Recommended)

- [ ] All form fields have labels
- [ ] Form has proper ARIA attributes
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (test with NVDA/JAWS)
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible

## Production Readiness

- [ ] Environment variables are set correctly
- [ ] WordPress API URL is configured
- [ ] CORS is configured if needed
- [ ] Error boundaries are in place
- [ ] Loading states are implemented
- [ ] 404 pages are implemented
- [ ] Build succeeds without errors: `npm run build`
- [ ] Production build works: `npm start`

## Documentation

- [ ] Read `CAREERS_ACF_SETUP.md`
- [ ] Read `CAREERS_IMPLEMENTATION_SUMMARY.md`
- [ ] Read `QUICK_START_CAREERS.md`
- [ ] Understand the ACF field structure
- [ ] Know how to add new careers
- [ ] Know how to modify the design

## Optional Enhancements (Future)

- [ ] Implement actual form submission (email/database)
- [ ] Add form validation messages
- [ ] Add success/error notifications
- [ ] Add career search functionality
- [ ] Add pagination for many careers
- [ ] Add social sharing buttons
- [ ] Add "Apply with LinkedIn" option
- [ ] Add career alerts/notifications
- [ ] Add analytics tracking
- [ ] Add structured data for SEO (JSON-LD)

## Troubleshooting

If something doesn't work, check:

1. **Careers not showing in WordPress admin**
   - Flush permalinks (Settings > Permalinks > Save)
   - Check functions.php for errors
   - Verify post type registration code

2. **ACF fields not appearing**
   - Check ACF plugin is active
   - Verify Location Rule is set correctly
   - Check field names match code

3. **Frontend shows no careers**
   - Check WordPress REST API: `/wp-json/wp/v2/careers`
   - Verify careers are published (not draft)
   - Check browser console for errors
   - Verify Next.js environment variables

4. **404 on career detail pages**
   - Flush permalinks in WordPress
   - Restart Next.js dev server
   - Check slug matches WordPress slug

5. **Filters not working**
   - Check ACF field names match component code
   - Verify careers have the filter fields filled in
   - Check browser console for JavaScript errors

## Sign-Off

Once all items are checked, the careers feature is ready for production!

**Completed by:** _______________
**Date:** _______________
**Notes:** _______________
