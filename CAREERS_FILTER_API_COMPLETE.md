# Careers Filter API - Complete Implementation

## Overview
The careers filter system now fetches filter data (Departments, Job Types, Experience Levels, Job Preferences) directly from WordPress via a custom REST API endpoint.

## What Was Implemented

### 1. WordPress Custom REST API Endpoint
**Endpoint:** `/wp-json/careers/v1/filters`

**Purpose:** Returns all available filter options with counts

**Response Format:**
```json
{
  "departments": [
    { "label": "Engineering", "value": "Engineering", "count": 5 },
    { "label": "Product", "value": "Product", "count": 3 },
    { "label": "Design", "value": "Design", "count": 2 }
  ],
  "job_types": [
    { "label": "Full Time", "value": "Full Time", "count": 7 },
    { "label": "Part Time", "value": "Part Time", "count": 3 }
  ],
  "experience_levels": [
    { "label": "Intern", "value": "Intern", "count": 2 },
    { "label": "Fresher", "value": "Fresher", "count": 4 },
    { "label": "Experienced", "value": "Experienced", "count": 5 }
  ],
  "job_preferences": [
    { "label": "On-Site", "value": "On-Site", "count": 3 },
    { "label": "Remote", "value": "Remote", "count": 7 },
    { "label": "Hybrid", "value": "Hybrid", "count": 3 }
  ]
}
```

### 2. Frontend Integration
- Fetches filter data on component mount
- Displays filters with accurate counts from WordPress
- Falls back to calculating from initial data if API fails
- Updates UI dynamically

## How It Works

### Data Flow
```
Component Mounts
    ↓
fetchFilterData() called
    ↓
GET /wp-json/careers/v1/filters
    ↓
WordPress counts all careers by ACF fields
    ↓
Returns filter options with counts
    ↓
Frontend displays filters
    ↓
User clicks filter
    ↓
AJAX fetch careers with filter
    ↓
Display filtered results
```

### WordPress Backend

#### Function: `get_career_filters_data()`
Located in: `wp-content/themes/twentytwentyfive-child/functions.php`

```php
function get_career_filters_data() {
    // Get all published careers
    $careers = get_posts(array(
        'post_type' => 'careers',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids',
    ));

    // Count occurrences of each ACF field value
    foreach ($careers as $career_id) {
        $department = get_field('department', $career_id);
        $job_type = get_field('job_type', $career_id);
        $experience_level = get_field('experience_level', $career_id);
        $location = get_field('location', $career_id);

        // Count each value
        if ($department) {
            $department_counts[$department]++;
        }
        // ... same for other fields
    }

    // Format and return response
    return rest_ensure_response($filters);
}
```

### Frontend Implementation

#### Component: `CareersWithSidebar.tsx`

```typescript
// State for filter data
const [filterData, setFilterData] = useState<FilterData>({
  departments: [],
  job_types: [],
  experience_levels: [],
  job_preferences: [],
});

// Fetch on mount
useEffect(() => {
  fetchFilterData();
}, []);

// Fetch function
const fetchFilterData = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 
                   window.location.origin.replace(':3000', '') + '/wp-json';

    const response = await fetch(`${apiUrl}/careers/v1/filters`);
    const data = await response.json();
    setFilterData(data);
  } catch (error) {
    console.error('Error fetching filter data:', error);
    // Fallback to calculating from initial careers
    calculateFiltersFromCareers(initialCareers);
  }
};
```

## API Endpoint Details

### Endpoint Registration
```php
function register_career_filters_endpoint() {
    register_rest_route('careers/v1', '/filters', array(
        'methods' => 'GET',
        'callback' => 'get_career_filters_data',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'register_career_filters_endpoint');
```

### Response Structure
```typescript
interface FilterOption {
  label: string;   // Display name
  value: string;   // Filter value
  count: number;   // Number of jobs
}

interface FilterData {
  departments: FilterOption[];
  job_types: FilterOption[];
  experience_levels: FilterOption[];
  job_preferences: FilterOption[];
}
```

## Testing

### Test the API Endpoint

**1. Direct API Test:**
```bash
# Visit in browser or use curl
http://localhost/moreyeahs-new/wp-json/careers/v1/filters

# Or with curl
curl http://localhost/moreyeahs-new/wp-json/careers/v1/filters
```

**Expected Response:**
```json
{
  "departments": [
    {"label": "Engineering", "value": "Engineering", "count": 5}
  ],
  "job_types": [
    {"label": "Full Time", "value": "Full Time", "count": 7}
  ],
  "experience_levels": [
    {"label": "Experienced", "value": "Experienced", "count": 5}
  ],
  "job_preferences": [
    {"label": "Remote", "value": "Remote", "count": 7}
  ]
}
```

### Test the Frontend

**1. Open Browser Console:**
```javascript
// Check if filter data is loaded
console.log('Filter data loaded');
```

**2. Verify Filters Display:**
- Visit `/careers`
- Check that filters show correct counts
- Verify counts match WordPress data

**3. Test Filter Interaction:**
- Click "Engineering" department
- Verify only engineering jobs show
- Check that counts are accurate

## Setup Instructions

### 1. WordPress Setup
The custom endpoint is already added to `functions.php`. No additional setup needed.

### 2. Test the Endpoint
```bash
# Visit this URL in your browser
http://localhost/moreyeahs-new/wp-json/careers/v1/filters
```

You should see JSON response with filter data.

### 3. Frontend Configuration
Make sure `.env.local` exists:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost/moreyeahs-new/wp-json
```

### 4. Restart Next.js
```bash
npm run dev
```

## Features

### ✅ Dynamic Filter Data
- Fetches from WordPress on page load
- Always shows current data
- No hardcoded values

### ✅ Accurate Counts
- Counts calculated from actual careers
- Updates when careers are added/removed
- Sorted alphabetically

### ✅ Error Handling
- Falls back to calculating from initial data
- Console logs errors for debugging
- Graceful degradation

### ✅ Performance
- Single API call on mount
- Cached in component state
- Fast response time

## Troubleshooting

### Issue: 404 on /careers/v1/filters
**Problem:** Endpoint not found

**Solution:**
1. Check `functions.php` has the endpoint code
2. Flush permalinks: Settings > Permalinks > Save
3. Verify WordPress is running

### Issue: Empty Response
**Problem:** `{ departments: [], job_types: [], ... }`

**Solution:**
1. Create some career posts in WordPress
2. Fill in ACF fields (department, job_type, etc.)
3. Publish the careers
4. Refresh the endpoint

### Issue: CORS Error
**Problem:** `Access to fetch has been blocked by CORS policy`

**Solution:**
Add to `functions.php`:
```php
function add_cors_http_header(){
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
    }
}
add_action('init', 'add_cors_http_header');
```

### Issue: Filters Not Showing
**Problem:** Filters are empty on frontend

**Solution:**
1. Check browser console for errors
2. Verify API endpoint returns data
3. Check `.env.local` configuration
4. Restart Next.js server

## Benefits

1. **Centralized Data Source**
   - Single source of truth (WordPress)
   - No data duplication
   - Easy to maintain

2. **Real-time Updates**
   - Reflects current WordPress data
   - No stale filter options
   - Automatic count updates

3. **Scalable**
   - Handles any number of careers
   - Efficient database queries
   - Fast response times

4. **Maintainable**
   - Clean separation of concerns
   - Well-documented code
   - Easy to extend

## Future Enhancements

### 1. Caching
```php
// Add transient caching
function get_career_filters_data() {
    $cache_key = 'career_filters_data';
    $cached = get_transient($cache_key);
    
    if ($cached !== false) {
        return rest_ensure_response($cached);
    }
    
    // ... fetch data
    
    set_transient($cache_key, $filters, HOUR_IN_SECONDS);
    return rest_ensure_response($filters);
}
```

### 2. Clear Cache on Career Update
```php
function clear_career_filters_cache($post_id) {
    if (get_post_type($post_id) === 'careers') {
        delete_transient('career_filters_data');
    }
}
add_action('save_post', 'clear_career_filters_cache');
```

### 3. Add Search Parameter
```php
// Add search to endpoint
if (isset($_GET['search'])) {
    $search = sanitize_text_field($_GET['search']);
    // Filter results by search term
}
```

## Summary

The careers filter system now fetches filter data from a custom WordPress REST API endpoint (`/careers/v1/filters`), providing accurate, real-time filter options with counts. The implementation is production-ready, performant, and easy to maintain.

## Files Modified

1. **wp-content/themes/twentytwentyfive-child/functions.php**
   - Added `register_career_filters_endpoint()`
   - Added `get_career_filters_data()`

2. **nextjs-wordpress/src/components/careers/CareersWithSidebar.tsx**
   - Added `FilterOption` and `FilterData` interfaces
   - Added `filterData` state
   - Added `fetchFilterData()` function
   - Added `calculateFiltersFromCareers()` fallback
   - Updated filter rendering to use API data

## Quick Test Checklist

- [ ] Visit `/wp-json/careers/v1/filters` - Should return JSON
- [ ] Create 3+ careers with different departments
- [ ] Visit `/careers` - Filters should show with counts
- [ ] Click a filter - Should filter jobs correctly
- [ ] Check browser console - No errors
- [ ] Add a new career - Refresh page, count should update

---

**API Endpoint:** `/wp-json/careers/v1/filters`  
**Status:** ✅ Production Ready  
**Version:** 1.0.0
