# Taxonomy Hierarchical Update - Complete Guide

## Overview
All career taxonomies have been converted from tag-style (non-hierarchical) to category-style (hierarchical) to match the Department taxonomy structure.

## What Changed

### Before (Tag-Style)
```php
'hierarchical' => false,  // Like tags
```

**Characteristics:**
- Flat structure (no parent/child)
- Tag-like interface
- No checkboxes
- Text input for adding

### After (Category-Style)
```php
'hierarchical' => true,  // Like categories
```

**Characteristics:**
- Hierarchical structure (parent/child support)
- Category-like interface
- Checkboxes for selection
- Dropdown for adding
- Can create sub-categories

## Updated Taxonomies

### 1. Job Type (`career_type`)
**Before:** Tag-style  
**After:** Category-style with hierarchy

**Benefits:**
- Can create parent types (e.g., "Employment Type")
- Can create child types (e.g., "Full-time", "Part-time" under "Employment Type")
- Better organization

### 2. Experience Level (`career_level`)
**Before:** Tag-style  
**After:** Category-style with hierarchy

**Benefits:**
- Can create levels (e.g., "Entry Level", "Mid Level", "Senior Level")
- Can create sub-levels if needed
- Better categorization

### 3. Job Preference (`career_preference`)
**Before:** Tag-style  
**After:** Category-style with hierarchy

**Benefits:**
- Can create main preferences (e.g., "Work Location")
- Can create sub-preferences (e.g., "On-Site", "Remote", "Hybrid")
- More flexible structure

## Implementation Details

### Code Changes

**Location:** `wp-content/themes/twentytwentyfive-child/functions.php`

#### Job Type Taxonomy
```php
// Added parent_item labels
$type_labels = array(
    'name'              => _x('Job Types', 'taxonomy general name', 'twentytwentyfive'),
    'singular_name'     => _x('Job Type', 'taxonomy singular name', 'twentytwentyfive'),
    'search_items'      => __('Search Job Types', 'twentytwentyfive'),
    'all_items'         => __('All Job Types', 'twentytwentyfive'),
    'parent_item'       => __('Parent Job Type', 'twentytwentyfive'),        // NEW
    'parent_item_colon' => __('Parent Job Type:', 'twentytwentyfive'),      // NEW
    'edit_item'         => __('Edit Job Type', 'twentytwentyfive'),
    'update_item'       => __('Update Job Type', 'twentytwentyfive'),
    'add_new_item'      => __('Add New Job Type', 'twentytwentyfive'),
    'new_item_name'     => __('New Job Type Name', 'twentytwentyfive'),
    'menu_name'         => __('Job Types', 'twentytwentyfive'),
);

register_taxonomy('career_type', array('careers'), array(
    'labels'            => $type_labels,
    'hierarchical'      => true,  // Changed from false to true
    'public'            => true,
    'show_ui'           => true,
    'show_in_rest'      => true,
    'show_admin_column' => true,
    'rewrite'           => array('slug' => 'job-type'),
));
```

#### Experience Level Taxonomy
```php
// Added parent_item labels
$level_labels = array(
    'name'              => _x('Experience Levels', 'taxonomy general name', 'twentytwentyfive'),
    'singular_name'     => _x('Experience Level', 'taxonomy singular name', 'twentytwentyfive'),
    'search_items'      => __('Search Experience Levels', 'twentytwentyfive'),
    'all_items'         => __('All Experience Levels', 'twentytwentyfive'),
    'parent_item'       => __('Parent Experience Level', 'twentytwentyfive'),        // NEW
    'parent_item_colon' => __('Parent Experience Level:', 'twentytwentyfive'),      // NEW
    'edit_item'         => __('Edit Experience Level', 'twentytwentyfive'),
    'update_item'       => __('Update Experience Level', 'twentytwentyfive'),
    'add_new_item'      => __('Add New Experience Level', 'twentytwentyfive'),
    'new_item_name'     => __('New Experience Level Name', 'twentytwentyfive'),
    'menu_name'         => __('Experience Levels', 'twentytwentyfive'),
);

register_taxonomy('career_level', array('careers'), array(
    'labels'            => $level_labels,
    'hierarchical'      => true,  // Changed from false to true
    'public'            => true,
    'show_ui'           => true,
    'show_in_rest'      => true,
    'show_admin_column' => true,
    'rewrite'           => array('slug' => 'experience-level'),
));
```

#### Job Preference Taxonomy
```php
// Added parent_item labels
$preference_labels = array(
    'name'              => _x('Job Preferences', 'taxonomy general name', 'twentytwentyfive'),
    'singular_name'     => _x('Job Preference', 'taxonomy singular name', 'twentytwentyfive'),
    'search_items'      => __('Search Job Preferences', 'twentytwentyfive'),
    'all_items'         => __('All Job Preferences', 'twentytwentyfive'),
    'parent_item'       => __('Parent Job Preference', 'twentytwentyfive'),        // NEW
    'parent_item_colon' => __('Parent Job Preference:', 'twentytwentyfive'),      // NEW
    'edit_item'         => __('Edit Job Preference', 'twentytwentyfive'),
    'update_item'       => __('Update Job Preference', 'twentytwentyfive'),
    'add_new_item'      => __('Add New Job Preference', 'twentytwentyfive'),
    'new_item_name'     => __('New Job Preference Name', 'twentytwentyfive'),
    'menu_name'         => __('Job Preferences', 'twentytwentyfive'),
);

register_taxonomy('career_preference', array('careers'), array(
    'labels'            => $preference_labels,
    'hierarchical'      => true,  // Changed from false to true
    'public'            => true,
    'show_ui'           => true,
    'show_in_rest'      => true,
    'show_admin_column' => true,
    'rewrite'           => array('slug' => 'job-preference'),
));
```

## Setup Instructions

### 1. Flush Permalinks (CRITICAL!)
```bash
WordPress Admin > Settings > Permalinks > Save Changes
```

This is **required** to activate the taxonomy changes.

### 2. Verify Changes in WordPress Admin

Go to **Careers** in WordPress admin sidebar. You should now see:
- Departments (category-style) ✓
- Job Types (category-style) ✓ NEW
- Experience Levels (category-style) ✓ NEW
- Job Preferences (category-style) ✓ NEW

### 3. Create Terms

#### Job Types
Go to **Careers > Job Types**:
- Full-time
- Part-time
- Contract
- Freelance
- Internship

#### Experience Levels
Go to **Careers > Experience Levels**:
- Intern
- Fresher
- Junior
- Mid-Level
- Senior
- Lead
- Manager

#### Job Preferences
Go to **Careers > Job Preferences**:
- On-Site
- Remote
- Hybrid
- Flexible
- Work from Home

### 4. Assign to Careers

When editing a career:
1. Look for taxonomy meta boxes on the right sidebar
2. You'll now see **checkboxes** instead of tag inputs
3. Check the appropriate terms
4. Save the career

## UI Changes in WordPress Admin

### Before (Tag-Style)
```
┌─────────────────────────┐
│ Job Types               │
├─────────────────────────┤
│ [Add new tag input]     │
│ Full-time, Part-time    │
└─────────────────────────┘
```

### After (Category-Style)
```
┌─────────────────────────┐
│ Job Types               │
├─────────────────────────┤
│ ☐ Full-time             │
│ ☐ Part-time             │
│ ☐ Contract              │
│ ☐ Freelance             │
│ + Add New Job Type      │
└─────────────────────────┘
```

## Benefits

### ✅ Better Organization
- Hierarchical structure
- Parent/child relationships
- Grouped categories

### ✅ Improved UI
- Checkboxes for easy selection
- Visual hierarchy
- Dropdown for parent selection

### ✅ Consistency
- All taxonomies work the same way
- Matches WordPress standards
- Familiar interface

### ✅ Flexibility
- Can create sub-categories
- Can reorganize structure
- Can add parent categories

### ✅ Bulk Operations
- Easier bulk editing
- Quick edit support
- Better admin experience

## Example Hierarchical Structure

### Job Types (with hierarchy)
```
Employment Type (Parent)
├── Full-time (Child)
├── Part-time (Child)
└── Contract (Child)

Work Arrangement (Parent)
├── Remote (Child)
├── On-Site (Child)
└── Hybrid (Child)
```

### Experience Levels (with hierarchy)
```
Entry Level (Parent)
├── Intern (Child)
└── Fresher (Child)

Professional (Parent)
├── Junior (Child)
├── Mid-Level (Child)
└── Senior (Child)

Leadership (Parent)
├── Lead (Child)
└── Manager (Child)
```

## REST API Impact

### No Breaking Changes
The REST API response remains the same:

```json
{
  "id": 123,
  "title": { "rendered": "Full Stack Developer" },
  "career_type": [5, 8],
  "career_level": [3],
  "career_preference": [2, 7]
}
```

### Embedded Data
When using `_embed`, you'll get full term data:

```json
{
  "_embedded": {
    "wp:term": [
      [
        {
          "id": 5,
          "name": "Full-time",
          "slug": "full-time",
          "taxonomy": "career_type",
          "parent": 0
        }
      ]
    ]
  }
}
```

## Frontend Impact

### No Code Changes Required
The frontend code continues to work without modifications because:
- Term IDs remain the same
- REST API structure unchanged
- Filter logic unchanged

### Filter Display
Filters will continue to show all terms (both parent and child) in a flat list, which is appropriate for filtering.

## Testing Checklist

- [ ] Flush permalinks (Settings > Permalinks > Save)
- [ ] Verify taxonomies show in Careers menu
- [ ] Create test terms in each taxonomy
- [ ] Edit a career and assign terms using checkboxes
- [ ] Save career and verify terms are saved
- [ ] Visit `/wp-json/wp/v2/careers` - Check taxonomy arrays
- [ ] Visit `/careers` on frontend
- [ ] Verify filters work correctly
- [ ] Test filtering by each taxonomy
- [ ] Verify counts are accurate

## Troubleshooting

### Issue: Still Seeing Tag Interface
**Problem:** Taxonomies still show as tags

**Solution:**
1. Flush permalinks (Settings > Permalinks > Save)
2. Clear browser cache
3. Hard refresh (Ctrl+F5)
4. Check functions.php for errors

### Issue: Terms Not Saving
**Problem:** Selected terms don't save

**Solution:**
1. Verify `hierarchical => true` in code
2. Flush permalinks
3. Check user permissions
4. Check for JavaScript errors

### Issue: Parent Dropdown Not Showing
**Problem:** Can't select parent term

**Solution:**
1. Verify parent_item labels are added
2. Flush permalinks
3. Create at least one term first
4. Refresh the page

## Migration Notes

### Existing Terms
- All existing terms remain intact
- No data loss
- Terms automatically work with new structure

### Existing Assignments
- All career-term relationships preserved
- No reassignment needed
- Everything continues to work

## Summary

All career taxonomies (Job Type, Experience Level, Job Preference) have been converted from tag-style to category-style (hierarchical) to provide:
- Better organization
- Improved admin UI
- Consistent experience
- Hierarchical structure support
- No breaking changes

## Files Modified

1. **wp-content/themes/twentytwentyfive-child/functions.php**
   - Changed `hierarchical` from `false` to `true` for all three taxonomies
   - Added `parent_item` and `parent_item_colon` labels

## Next Steps

1. **Flush permalinks** in WordPress
2. **Create taxonomy terms** for each taxonomy
3. **Assign terms** to existing careers
4. **Test the admin interface** with checkboxes
5. **Verify frontend** filters still work

---

**Status:** ✅ Complete  
**Breaking Changes:** None  
**Migration Required:** No  
**Version:** 1.0.0
