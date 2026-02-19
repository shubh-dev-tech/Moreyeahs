# Careers Filter Update - Dynamic Filtering from WordPress

## Overview
The careers filter system has been updated to be fully dynamic, pulling data from WordPress ACF fields and updating counts in real-time based on the actual job postings.

## What Changed

### 1. New ACF Field Added
**Field Name:** `experience_level`
- **Type:** Text
- **Purpose:** To categorize jobs by experience level (Intern, Fresher, Experienced)
- **Location:** Add this field in WordPress ACF under Career Details field group

### 2. Dynamic Filter Counts
All filter counts are now calculated dynamically from the actual career posts:

**Before:**
```tsx
<h3>All Experience Level (3)</h3>  // Hardcoded
<span>Intern (2)</span>             // Hardcoded
```

**After:**
```tsx
<h3>All Experience Level ({totalCount})</h3>  // Dynamic
<span>Intern ({internCount})</span>           // Dynamic from data
```

### 3. Four Filter Categories

#### Experience Level Filter
- Dynamically counts jobs by `experience_level` ACF field
- Options: Intern, Fresher, Experienced, or any custom value
- Shows count for each level

#### Department Filter (All positions)
- Dynamically counts jobs by `department` ACF field
- Options: Engineering, Product, Design, Marketing, etc.
- Shows count for each department

#### Job Type Filter
- Dynamically counts jobs by `job_type` ACF field
- Options: Full Time, Part Time, Contract, etc.
- Shows count for each type

#### Job Preference Filter
- Dynamically counts jobs by `location` ACF field
- Options: On-Site, Remote, Hybrid
- Shows count for each preference

### 4. Active State Styling
Filters now have visual feedback:
- Selected filter has gray background
- Blue left border on active filter
- Bold text for active selection

### 5. Real-time Filtering
When a filter is selected:
- Job list updates immediately
- Job count updates in the title
- Multiple filters can be combined
- All filters work together (AND logic)

## Implementation Details

### Filter Count Calculation
```typescript
const getFilterCounts = () => {
  const levelCounts: FilterCount = {};
  const departmentCounts: FilterCount = {};
  const typeCounts: FilterCount = {};
  const preferenceCounts: FilterCount = {};

  careers.forEach(career => {
    // Count each field value
    const level = career.acf_fields?.experience_level || 'Other';
    levelCounts[level] = (levelCounts[level] || 0) + 1;
    // ... same for other fields
  });

  return { levelCounts, departmentCounts, typeCounts, preferenceCounts };
};
```

### Filter Logic
```typescript
useEffect(() => {
  let filtered = careers;

  if (selectedLevel !== 'all') {
    filtered = filtered.filter(c => 
      c.acf_fields?.experience_level === selectedLevel
    );
  }

  if (selectedDepartment !== 'all') {
    filtered = filtered.filter(c => 
      c.acf_fields?.department === selectedDepartment
    );
  }

  // ... same for other filters

  setFilteredCareers(filtered);
}, [selectedLevel, selectedDepartment, selectedType, selectedPreference, careers]);
```

## ACF Field Setup

### Add Experience Level Field

1. Go to **Custom Fields > Career Details** in WordPress admin
2. Add new field after `location`:
   - **Field Label:** Experience Level
   - **Field Name:** `experience_level`
   - **Field Type:** Text
   - **Placeholder:** e.g., Experienced
3. Click "Update" to save

### Field Values to Use

**Experience Level:**
- Intern
- Fresher
- Experienced

**Job Type:**
- Full Time
- Part Time
- Contract
- Freelance

**Department:**
- Engineering
- Product
- Design
- Marketing
- Sales
- Operations

**Location / Job Preference:**
- On-Site
- Remote
- Hybrid

## Usage Example

### Creating a Job Post

1. **Title:** Full Stack Developer
2. **ACF Fields:**
   - Job Type: `Full Time`
   - Department: `Engineering`
   - Location: `Remote`
   - Experience Level: `Experienced`
3. **Publish**

### Result on Frontend

The filters will automatically show:
- Experience Level: Experienced (1)
- Department: Engineering (1)
- Job Type: Full Time (1)
- Job Preference: Remote (1)

As you add more jobs, the counts update automatically!

## CSS Updates

### New Styles Added

```css
.filterOption.active {
  background: #f0f0f0;
  color: #1a1a1a;
  font-weight: 500;
  border-left-color: #667eea;
}

.filterTitle {
  border-left: 3px solid transparent;
}

.filterOption {
  border-left: 3px solid transparent;
  padding: 10px 8px;
  border-radius: 4px;
}
```

### Visual Feedback
- Hover: Light gray background
- Active: Gray background with blue left border
- Radio buttons: Blue accent color

## Testing

### Test Scenario 1: Single Filter
1. Create 3 jobs with different experience levels
2. Visit `/careers`
3. Click "Intern" filter
4. Verify only intern jobs show
5. Verify count updates

### Test Scenario 2: Multiple Filters
1. Create jobs with various combinations
2. Select "Engineering" department
3. Then select "Remote" preference
4. Verify only remote engineering jobs show
5. Verify counts are correct

### Test Scenario 3: Dynamic Counts
1. Create 5 engineering jobs
2. Create 3 product jobs
3. Visit `/careers`
4. Verify "Engineering (5)" shows
5. Verify "Product (3)" shows
6. Delete 1 engineering job
7. Refresh page
8. Verify "Engineering (4)" shows

## Files Modified

1. **nextjs-wordpress/src/components/careers/CareersWithSidebar.tsx**
   - Added dynamic filter count calculation
   - Added experience_level filter
   - Added active state styling
   - Updated filter logic

2. **nextjs-wordpress/src/components/careers/CareersWithSidebar.module.css**
   - Added active state styles
   - Updated filter option styles
   - Added border-left styling
   - Improved hover states

3. **nextjs-wordpress/src/app/careers/page.tsx**
   - Added experience_level to interface

4. **nextjs-wordpress/src/components/careers/index.ts**
   - Added experience_level to CareerData interface

5. **wp-content/themes/twentytwentyfive-child/acf-careers-fields-template.php**
   - Added experience_level field definition

6. **CAREERS_ACF_SETUP.md**
   - Updated with experience_level field
   - Updated example data

## Benefits

✅ **Fully Dynamic:** No hardcoded values  
✅ **Real-time Updates:** Counts update as you add/remove jobs  
✅ **Flexible:** Any field value works, not limited to predefined options  
✅ **User-Friendly:** Clear visual feedback on active filters  
✅ **Performant:** Client-side filtering for instant results  
✅ **Maintainable:** Easy to add new filter categories  

## Future Enhancements

Possible improvements:
- Add search functionality
- Add sorting options (newest, oldest, alphabetical)
- Add "Clear all filters" button
- Add URL parameters for shareable filter states
- Add filter animations
- Add loading states for better UX

## Troubleshooting

### Filters showing "Other (X)"
- This means some jobs don't have the ACF field filled in
- Go to those jobs and fill in the missing fields

### Counts not updating
- Clear browser cache
- Restart Next.js dev server
- Verify ACF fields are saved in WordPress

### Filter not working
- Check ACF field names match exactly
- Verify field values are consistent (case-sensitive)
- Check browser console for errors

## Summary

The careers filter system is now fully dynamic and pulls all data from WordPress ACF fields. The counts update automatically based on the actual job postings, and the UI provides clear visual feedback for active filters. This makes the system maintainable and scalable as you add more job postings.
