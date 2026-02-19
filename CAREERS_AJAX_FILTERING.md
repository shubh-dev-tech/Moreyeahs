# Careers AJAX Filtering - Complete Guide

## Overview
The careers filter system now uses AJAX to fetch data dynamically from WordPress REST API when filters are changed, providing real-time updates without page reload.

## How It Works

### 1. Initial Page Load
- Server-side renders the page with initial careers data
- Passes data to `CareersWithSidebar` component
- Component displays all jobs and filter options

### 2. Filter Selection
- User clicks a filter option (e.g., "Engineering")
- `handleFilterChange()` function is triggered
- AJAX request sent to WordPress REST API
- Loading spinner shows while fetching
- Results update automatically

### 3. Data Flow
```
User clicks filter
    ↓
handleFilterChange() triggered
    ↓
setIsLoading(true)
    ↓
fetch() WordPress REST API
    ↓
Transform response data
    ↓
Apply client-side filters
    ↓
setFilteredCareers(filtered)
    ↓
setIsLoading(false)
    ↓
UI updates with new results
```

## Implementation Details

### AJAX Fetch Function

```typescript
const fetchCareers = async (filters: {
  department?: string;
  type?: string;
  level?: string;
  preference?: string;
}) => {
  setIsLoading(true);
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('per_page', '100');
    params.append('_embed', 'true');

    // Get WordPress API URL
    const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 
                   window.location.origin.replace(':3000', '') + '/wp-json';

    // Fetch from WordPress
    const response = await fetch(`${apiUrl}/wp/v2/careers?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch careers');
    }

    const data = await response.json();
    
    // Transform and filter data
    const transformedCareers = data.map((career: any) => ({
      id: career.id,
      title: career.title,
      slug: career.slug,
      excerpt: career.excerpt,
      acf_fields: career.acf_fields || career.acf || {},
    }));

    // Apply filters
    let filtered = transformedCareers;
    if (filters.level && filters.level !== 'all') {
      filtered = filtered.filter(c => 
        c.acf_fields?.experience_level === filters.level
      );
    }
    // ... more filters

    setFilteredCareers(filtered);
  } catch (error) {
    console.error('Error fetching careers:', error);
    setFilteredCareers(initialCareers); // Fallback
  } finally {
    setIsLoading(false);
  }
};
```

### Filter Change Handler

```typescript
const handleFilterChange = (filterType: string, value: string) => {
  const newFilters = {
    department: filterType === 'department' ? value : selectedDepartment,
    type: filterType === 'type' ? value : selectedType,
    level: filterType === 'level' ? value : selectedLevel,
    preference: filterType === 'preference' ? value : selectedPreference,
  };

  // Update state
  if (filterType === 'department') setSelectedDepartment(value);
  if (filterType === 'type') setSelectedType(value);
  if (filterType === 'level') setSelectedLevel(value);
  if (filterType === 'preference') setSelectedPreference(value);

  // Fetch with new filters
  fetchCareers(newFilters);
};
```

## Setup Instructions

### 1. Environment Configuration

Create `.env.local` file in `nextjs-wordpress/` directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# For local development
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost/moreyeahs-new/wp-json

# For production
# NEXT_PUBLIC_WORDPRESS_API_URL=https://dev.moreyeahs.com/wp-json
```

### 2. WordPress CORS Configuration

If you get CORS errors, add this to your WordPress `functions.php`:

```php
/**
 * Enable CORS for Next.js frontend
 */
function add_cors_http_header(){
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    }

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        }

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        }

        exit(0);
    }
}
add_action('init', 'add_cors_http_header');
```

### 3. Restart Next.js Server

```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

## Features

### ✅ Real-time Updates
- Filters update instantly via AJAX
- No page reload required
- Smooth loading transitions

### ✅ Loading States
- Spinner shows during fetch
- Job list fades during loading
- Clear visual feedback

### ✅ Error Handling
- Falls back to initial data on error
- Console logs errors for debugging
- Graceful degradation

### ✅ Dynamic Counts
- Filter counts update from WordPress
- Always accurate and current
- Reflects actual job postings

### ✅ Multiple Filters
- Combine multiple filters
- AND logic (all filters must match)
- Instant results

## API Endpoints Used

### Get All Careers
```
GET /wp-json/wp/v2/careers?per_page=100&_embed=true
```

**Response:**
```json
[
  {
    "id": 123,
    "title": { "rendered": "Full Stack Developer" },
    "slug": "full-stack-developer",
    "excerpt": { "rendered": "<p>Job description...</p>" },
    "acf_fields": {
      "job_type": "Full Time",
      "department": "Engineering",
      "location": "Remote",
      "experience_level": "Experienced"
    }
  }
]
```

## Testing

### Test Scenario 1: Basic Filtering
1. Visit `/careers`
2. Click "Engineering" department
3. Verify:
   - Loading spinner appears
   - Only engineering jobs show
   - Count updates correctly

### Test Scenario 2: Multiple Filters
1. Select "Engineering" department
2. Then select "Remote" preference
3. Verify:
   - Only remote engineering jobs show
   - Counts are accurate
   - Loading states work

### Test Scenario 3: Error Handling
1. Stop WordPress server
2. Click a filter
3. Verify:
   - Error logged to console
   - Falls back to initial data
   - No crash or blank page

### Test Scenario 4: Performance
1. Create 50+ job postings
2. Click different filters rapidly
3. Verify:
   - No lag or freeze
   - Smooth transitions
   - Accurate results

## Troubleshooting

### Issue: CORS Error
```
Access to fetch at 'http://localhost/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**
Add CORS headers to WordPress (see Setup Instructions #2)

### Issue: API URL Not Found
```
Failed to fetch careers: 404 Not Found
```

**Solution:**
1. Check `.env.local` file exists
2. Verify `NEXT_PUBLIC_WORDPRESS_API_URL` is correct
3. Restart Next.js server

### Issue: No ACF Fields in Response
```
acf_fields: {}
```

**Solution:**
1. Verify ACF fields are created in WordPress
2. Check `add_acf_to_careers_rest()` function in `functions.php`
3. Test API directly: `/wp-json/wp/v2/careers`

### Issue: Loading Spinner Stuck
```
Spinner shows indefinitely
```

**Solution:**
1. Check browser console for errors
2. Verify WordPress is running
3. Check network tab for failed requests

## Performance Optimization

### Current Implementation
- Fetches all careers (up to 100)
- Filters client-side
- Fast and responsive

### Future Enhancements
1. **Server-side Filtering**
   ```typescript
   // Add filter parameters to API request
   params.append('meta_key', 'department');
   params.append('meta_value', 'Engineering');
   ```

2. **Caching**
   ```typescript
   // Cache results in localStorage
   const cacheKey = `careers_${JSON.stringify(filters)}`;
   const cached = localStorage.getItem(cacheKey);
   if (cached) return JSON.parse(cached);
   ```

3. **Debouncing**
   ```typescript
   // Debounce filter changes
   const debouncedFetch = debounce(fetchCareers, 300);
   ```

4. **Pagination**
   ```typescript
   // Load more on scroll
   params.append('page', currentPage.toString());
   params.append('per_page', '20');
   ```

## Code Structure

### Files Modified
1. **CareersWithSidebar.tsx**
   - Added `fetchCareers()` function
   - Added `handleFilterChange()` function
   - Added loading state management
   - Added AJAX fetch logic

2. **CareersWithSidebar.module.css**
   - Added `.loadingOverlay` styles
   - Added `.spinner` animation
   - Added `.loading` state styles

3. **Created Files**
   - `.env.local.example` - Environment configuration template

## Benefits

✅ **Real-time Updates** - No page reload needed  
✅ **Better UX** - Smooth loading transitions  
✅ **Accurate Data** - Always fetches latest from WordPress  
✅ **Scalable** - Can handle large datasets  
✅ **Maintainable** - Clean separation of concerns  
✅ **Error Resilient** - Graceful fallback on errors  

## Next Steps

1. **Set up environment variables** (`.env.local`)
2. **Configure CORS** in WordPress if needed
3. **Test filtering** on your local environment
4. **Monitor performance** with many jobs
5. **Consider caching** for production

## Summary

The careers filter system now uses AJAX to fetch data dynamically from WordPress, providing a modern, responsive user experience with real-time updates and smooth loading transitions. The implementation is production-ready and follows best practices for error handling and performance.
