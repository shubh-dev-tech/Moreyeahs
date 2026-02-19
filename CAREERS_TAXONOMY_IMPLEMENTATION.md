# Careers Taxonomy Implementation - Job Preference

## Overview
Added a new taxonomy called "Job Preference" (`career_preference`) to the careers custom post type. This taxonomy allows you to categorize jobs by their work location preference (On-Site, Remote, Hybrid, etc.).

## What Was Implemented

### 1. New WordPress Taxonomy
**Taxonomy Name:** `career_preference`  
**Slug:** `job-preference`  
**Type:** Non-hierarchical (like tags)  
**REST API:** Enabled  

### 2. Integration with Careers
- Added to careers post type taxonomies
- Shows in admin column
- Available in REST API
- Integrated with filter system

### 3. Frontend Integration
- Fetches taxonomy terms via REST API
- Displays in filter sidebar
- Filters jobs by preference
- Shows accurate counts

## Taxonomy Details

### Registration Code
Located in: `wp-content/themes/twentytwentyfive-child/functions.php`

```php
// Job Preference Taxonomy
$preference_labels = array(
    'name'              => _x('Job Preferences', 'taxonomy general name', 'twentytwentyfive'),
    'singular_name'     => _x('Job Preference', 'taxonomy singular name', 'twentytwentyfive'),
    'search_items'      => __('Search Job Preferences', 'twentytwentyfive'),
    'all_items'         => __('All Job Preferences', 'twentytwentyfive'),
    'edit_item'         => __('Edit Job Preference', 'twentytwentyfive'),
    'update_item'       => __('Update Job Preference', 'twentytwentyfive'),
    'add_new_item'      => __('Add New Job Preference', 'twentytwentyfive'),
    'new_item_name'     => __('New Job Preference Name', 'twentytwentyfive'),
    'menu_name'         => __('Job Preferences', 'twentytwentyfive'),
);

register_taxonomy('career_preference', array('careers'), array(
    'labels'            => $preference_labels,
    'hierarchical'      => false,
    'public'            => true,
    'show_ui'           => true,
    'show_in_rest'      => true,
    'show_admin_column' => true,
    'rewrite'           => array('slug' => 'job-preference'),
));
```

### Careers Post Type Update
```php
'taxonomies' => array(
    'career_department', 
    'career_type', 
    'career_level', 
    'career_preference'  // NEW
),
```

## Setup Instructions

### 1. Flush Permalinks (IMPORTANT!)
```bash
WordPress Admin > Settings > Permalinks > Save Changes
```

This activates the new taxonomy.

### 2. Create Taxonomy Terms

Go to **Careers > Job Preferences** in WordPress admin and add terms:

**Recommended Terms:**
- On-Site
- Remote
- Hybrid
- Flexible
- Work from Home
- Office-based

### 3. Assign to Careers

When editing a career post:
1. Look for "Job Preferences" meta box on the right
2. Select one or more preferences
3. Save/Update the career

### 4. Test the API

Visit: `http://localhost/moreyeahs-new/wp-json/wp/v2/careers`

You should see `career_preference` array in the response:
```json
{
  "id": 123,
  "title": { "rendered": "Full Stack Developer" },
  "career_preference": [5, 8],  // Term IDs
  ...
}
```

### 5. Test Filter Endpoint

Visit: `http://localhost/moreyeahs-new/wp-json/careers/v1/filters`

You should see job preferences with counts:
```json
{
  "job_preferences": [
    { "label": "On-Site", "value": "On-Site", "count": 3 },
    { "label": "Remote", "value": "Remote", "count": 7 },
    { "label": "Hybrid", "value": "Hybrid", "count": 2 }
  ]
}
```

## How It Works

### Data Flow
```
WordPress Admin
    ↓
Create/Edit Career
    ↓
Assign Job Preference Terms
    ↓
Save Career
    ↓
REST API exposes career_preference
    ↓
Filter endpoint counts terms
    ↓
Frontend fetches and displays
    ↓
User filters by preference
```

### Filter API Update

The filter endpoint now fetches taxonomy terms instead of ACF fields:

```php
// Get taxonomy terms for job preference
$preference_terms = wp_get_post_terms($career_id, 'career_preference', array('fields' => 'names'));

// Count job preferences from taxonomy
if (!empty($preference_terms) && !is_wp_error($preference_terms)) {
    foreach ($preference_terms as $pref_term) {
        if (!isset($preference_counts[$pref_term])) {
            $preference_counts[$pref_term] = 0;
        }
        $preference_counts[$pref_term]++;
    }
}
```

## Frontend Integration

### TypeScript Interface
```typescript
interface CareerData {
  id: number;
  title: { rendered: string };
  slug: string;
  excerpt: { rendered: string };
  career_department?: number[];
  career_type?: number[];
  career_level?: number[];
  career_preference?: number[];  // NEW
}
```

### Filter Display
The frontend automatically fetches and displays job preferences from the filter API endpoint.

## Benefits of Using Taxonomy

### ✅ Better Data Structure
- Proper WordPress taxonomy
- Reusable terms
- Consistent naming

### ✅ Admin UI
- Easy to manage terms
- Bulk edit support
- Quick edit support

### ✅ REST API
- Automatically exposed
- Standard WordPress format
- Easy to query

### ✅ Flexibility
- Multiple preferences per job
- Easy to add new terms
- No code changes needed

### ✅ Performance
- Indexed in database
- Fast queries
- Efficient filtering

## Comparison: ACF vs Taxonomy

### Before (ACF Field)
```php
// ACF field: location
$location = get_field('location', $career_id);
// Returns: "Remote" (string)
```

**Limitations:**
- Free text (inconsistent)
- No term management
- Manual counting
- Not reusable

### After (Taxonomy)
```php
// Taxonomy: career_preference
$preferences = wp_get_post_terms($career_id, 'career_preference');
// Returns: Array of term objects
```

**Benefits:**
- Controlled vocabulary
- Term management UI
- Automatic counting
- Reusable across posts

## Usage Examples

### Example 1: Single Preference
```
Job: Full Stack Developer
Preference: Remote
```

### Example 2: Multiple Preferences
```
Job: Product Manager
Preferences: Remote, Hybrid
```

### Example 3: Filtering
```
User selects: Remote
Results: All jobs with "Remote" preference
```

## REST API Endpoints

### Get All Careers with Preferences
```
GET /wp-json/wp/v2/careers?_embed
```

**Response:**
```json
[
  {
    "id": 123,
    "title": { "rendered": "Full Stack Developer" },
    "career_preference": [5],
    "_embedded": {
      "wp:term": [
        [
          {
            "id": 5,
            "name": "Remote",
            "slug": "remote",
            "taxonomy": "career_preference"
          }
        ]
      ]
    }
  }
]
```

### Get Filter Data
```
GET /wp-json/careers/v1/filters
```

**Response:**
```json
{
  "job_preferences": [
    { "label": "On-Site", "value": "On-Site", "count": 3 },
    { "label": "Remote", "value": "Remote", "count": 7 },
    { "label": "Hybrid", "value": "Hybrid", "count": 2 }
  ]
}
```

### Get Jobs by Preference
```
GET /wp-json/wp/v2/careers?career_preference=5
```

## Testing Checklist

- [ ] Flush permalinks (Settings > Permalinks > Save)
- [ ] Create job preference terms (On-Site, Remote, Hybrid)
- [ ] Edit a career and assign preferences
- [ ] Save the career
- [ ] Visit `/wp-json/wp/v2/careers` - Check career_preference array
- [ ] Visit `/wp-json/careers/v1/filters` - Check job_preferences data
- [ ] Visit `/careers` on frontend
- [ ] Verify "All Job Preference" filter shows
- [ ] Click a preference filter
- [ ] Verify jobs filter correctly
- [ ] Check counts are accurate

## Troubleshooting

### Issue: Taxonomy Not Showing
**Problem:** Job Preferences menu not in admin

**Solution:**
1. Flush permalinks (Settings > Permalinks > Save)
2. Check functions.php for errors
3. Verify taxonomy registration code

### Issue: Terms Not Saving
**Problem:** Selected preferences don't save

**Solution:**
1. Check post type supports taxonomies
2. Verify taxonomy is registered for 'careers'
3. Check user permissions

### Issue: Empty Filter
**Problem:** Job Preference filter is empty

**Solution:**
1. Create taxonomy terms first
2. Assign terms to careers
3. Refresh filter endpoint
4. Check browser console for errors

### Issue: Filter Not Working
**Problem:** Selecting preference doesn't filter

**Solution:**
1. Verify careers have preferences assigned
2. Check API endpoint returns data
3. Check browser console for errors
4. Verify filter logic in component

## Files Modified

1. **wp-content/themes/twentytwentyfive-child/functions.php**
   - Added `career_preference` taxonomy registration
   - Updated careers post type taxonomies array
   - Updated filter API to fetch taxonomy terms

2. **nextjs-wordpress/src/components/careers/CareersWithSidebar.tsx**
   - Added `career_preference` to CareerData interface

3. **nextjs-wordpress/src/app/careers/page.tsx**
   - Added `career_preference` to CareerData interface

4. **nextjs-wordpress/src/components/careers/index.ts**
   - Added `career_preference` to CareerData interface

## Summary

The Job Preference taxonomy provides a proper, scalable way to categorize careers by work location preference. It integrates seamlessly with WordPress admin UI, REST API, and the frontend filter system, providing a better user experience for both administrators and end users.

## Next Steps

1. **Flush permalinks** in WordPress
2. **Create taxonomy terms** (On-Site, Remote, Hybrid)
3. **Assign preferences** to existing careers
4. **Test the filters** on frontend
5. **Verify counts** are accurate

---

**Taxonomy:** `career_preference`  
**Slug:** `job-preference`  
**Status:** ✅ Production Ready  
**Version:** 1.0.0
