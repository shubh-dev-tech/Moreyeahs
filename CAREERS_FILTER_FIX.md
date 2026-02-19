# Careers Filter Fix

## Issues Fixed

### 1. "All Experience Level" Not Clickable
**Problem**: The Experience Level filter group was missing an "All Levels" option, making it impossible to reset the filter.

**Solution**: Added an "All Levels" radio button option at the top of the Experience Level filter group, matching the pattern used in other filter groups (Department, Job Type, Job Preference).

```tsx
<label 
  className={`${styles.filterOption} ${selectedLevel === 'all' ? styles.active : ''}`}
>
  <input
    type="radio"
    name="level"
    value="all"
    checked={selectedLevel === 'all'}
    onChange={(e) => handleFilterChange('level', e.target.value)}
  />
  <span>All Levels</span>
</label>
```

### 2. "No Jobs Found" When Selecting Filters
**Problem**: When any filter was selected, it showed "No jobs found matching your filters" because:
- The `fetchCareers` function was re-fetching all careers from the API on every filter change
- The filtering logic wasn't properly applied to the existing careers data
- The component was trying to do server-side filtering when it should do client-side filtering

**Solution**: 
- Removed the `fetchCareers` function that was unnecessarily re-fetching data
- Created a new `applyFilters` function that performs client-side filtering on the existing `allCareers` data
- Updated `handleFilterChange` to call `applyFilters` instead of `fetchCareers`
- Removed unused `getFilterCounts` function that was causing linting warnings

```tsx
const applyFilters = (filters: {
  department?: string;
  type?: string;
  level?: string;
  preference?: string;
}) => {
  setIsLoading(true);
  
  try {
    // Start with all careers
    let filtered = [...allCareers];

    // Apply each filter if not 'all'
    if (filters.level && filters.level !== 'all') {
      filtered = filtered.filter(c => c.acf_fields?.experience_level === filters.level);
    }

    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(c => c.acf_fields?.department === filters.department);
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(c => c.acf_fields?.job_type === filters.type);
    }

    if (filters.preference && filters.preference !== 'all') {
      filtered = filtered.filter(c => c.acf_fields?.location === filters.preference);
    }

    setFilteredCareers(filtered);
  } catch (error) {
    console.error('Error applying filters:', error);
    setFilteredCareers(allCareers);
  } finally {
    setIsLoading(false);
  }
};
```

## How It Works Now

1. **Initial Load**: All careers are fetched once on page load and stored in `allCareers` state
2. **Filter Selection**: When a user selects any filter, the `applyFilters` function filters the `allCareers` array client-side
3. **Multiple Filters**: All active filters are applied together (AND logic)
4. **Reset Filters**: Selecting "All Levels", "All Departments", "All Types", or "All Preferences" removes that filter
5. **Performance**: Fast filtering since it's all client-side with no API calls

## Testing

Test the following scenarios:
1. Click "All Levels" - should show all jobs
2. Select a specific experience level - should filter jobs
3. Select multiple filters together - should show jobs matching all criteria
4. Reset filters one by one - should update results accordingly
5. Verify job counts in filter labels match the actual results
