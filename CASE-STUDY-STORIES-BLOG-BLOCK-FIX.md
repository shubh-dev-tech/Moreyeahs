# Case Study Stories & Blog Block Fix

## Issue
When selecting "Case Study" in the dropdown of the Stories & Blog Block, no data is displayed from case study posts.

## Root Causes Identified

1. **Missing Post Type Mapping**: The React component didn't have proper endpoint mapping for `case_study` post type
2. **Hardcoded ACF Choices**: The child theme's ACF JSON file had hardcoded post type choices instead of relying on dynamic population
3. **Missing Taxonomies**: Case study post type wasn't associated with the category taxonomy
4. **API Endpoint Issues**: The custom posts-data endpoint wasn't handling different post types correctly

## Files Modified

### 1. React Component Updates
**File**: `nextjs-wordpress/src/components/blocks/stories-blog-block/StoriesBlogBlock.tsx`

**Changes**:
- Added `case_study` to endpoint mapping fallback
- Added `case_study` to post type label mapping
- Improved API call logic to handle case study posts specifically
- Enhanced error handling and fallback mechanisms

### 2. WordPress Functions Updates
**File**: `wp-content/themes/twentytwentyfive-child/functions.php`

**Changes**:
- Added `'taxonomies' => array('category', 'post_tag')` to case study post type registration
- Enhanced posts-data endpoint to handle different post types
- Added proper featured image and metadata handling
- Added theme switch hook to flush rewrite rules

### 3. ACF Configuration Updates
**File**: `wp-content/themes/twentytwentyfive-child/acf-json/group_stories_blog_block.json`

**Changes**:
- Reset post type choices to allow dynamic population
- Reset category choices to allow dynamic population
- Added missing `card_label` field
- Removed hardcoded values that were preventing dynamic loading

## Key Fixes Applied

### 1. Post Type Registration Fix
```php
'taxonomies' => array('category', 'post_tag'), // Added this line
```
This ensures case studies can use WordPress categories.

### 2. React Component Endpoint Mapping
```javascript
const endpointMap: { [key: string]: string } = {
  // ... other mappings
  'case_study': 'case_study', // Added this mapping
};
```

### 3. Enhanced API Call Logic
```javascript
// For case_study post type, try the specific endpoint first
if (post_type === 'case_study') {
  try {
    const response = await fetch(`${CLIENT_WORDPRESS_API_URL}${endpoint}?${params}`);
    if (response.ok) {
      postsData = await response.json();
    }
  } catch (caseStudyError) {
    console.warn('Case study endpoint failed, trying fallback:', caseStudyError);
  }
}
```

### 4. Improved Posts-Data Endpoint
```php
$args = [
    'post_type' => isset($params['post_type']) ? sanitize_text_field($params['post_type']) : 'post',
    'post_status' => 'publish',
    'posts_per_page' => isset($params['per_page']) ? intval($params['per_page']) : 10,
    'orderby' => isset($params['orderby']) ? sanitize_text_field($params['orderby']) : 'date',
    'order' => isset($params['order']) ? sanitize_text_field($params['order']) : 'DESC',
];

// Add category filter if provided
if (isset($params['categories']) && !empty($params['categories'])) {
    $args['cat'] = intval($params['categories']);
}
```

## Testing Files Created

1. **test-case-study-api.php** - Comprehensive API testing
2. **create-test-case-studies.php** - Creates sample case study posts
3. **test-acf-dynamic-fields.php** - Tests ACF dynamic field population

## How to Test

1. **Run API Tests**:
   - Visit `http://your-site.com/test-case-study-api.php`
   - Verify all tests pass

2. **Create Test Data**:
   - Visit `http://your-site.com/create-test-case-studies.php`
   - Click "Create Test Case Studies"

3. **Test ACF Fields**:
   - Visit `http://your-site.com/test-acf-dynamic-fields.php`
   - Verify dynamic population is working

4. **Test in WordPress Admin**:
   - Go to Pages → Add New
   - Add "Stories & Blog Block"
   - Select "Case Studies" from post type dropdown
   - Verify categories populate
   - Save and view page

## Expected Results

After applying these fixes:

1. ✅ "Case Studies" appears in the post type dropdown
2. ✅ Categories populate when case studies is selected
3. ✅ Case study posts display in the block
4. ✅ Proper labels show ("CASE STUDY" instead of generic labels)
5. ✅ Featured images and excerpts display correctly
6. ✅ Links work properly

## Troubleshooting

If issues persist:

1. **Clear Caches**: Clear WordPress cache, browser cache, and any CDN cache
2. **Flush Rewrite Rules**: Go to Settings → Permalinks and click "Save Changes"
3. **Check Post Type Registration**: Ensure case study post type is properly registered
4. **Verify Taxonomies**: Ensure case studies have category taxonomy assigned
5. **Test API Endpoints**: Use the provided test files to verify API functionality

## Notes

- The fix maintains backward compatibility with existing functionality
- All changes are made in the child theme to preserve customizations
- The solution uses WordPress best practices for custom post types and REST API
- Dynamic field population ensures the dropdown stays current with available post types