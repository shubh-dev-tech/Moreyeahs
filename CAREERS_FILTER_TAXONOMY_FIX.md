# Careers Filter Taxonomy Fix - Complete Solution

## Root Cause Analysis

The filtering system was completely broken because:

1. **Data Structure Mismatch**: Careers use WordPress taxonomies (`career_department`, `career_type`, `career_level`, `career_preference`) but the component was trying to filter by ACF fields
2. **Missing "All Levels" Option**: Experience Level filter had no way to reset/show all items
3. **Wrong Filter Logic**: Component was comparing taxonomy IDs against ACF field strings

## Solution Implemented

### 1. Complete Component Rewrite

Rewrote `CareersWithSidebar.tsx` to properly use WordPress taxonomies:

#### Key Changes:

**State Management**:
```tsx
// Changed from string values to taxonomy IDs (numbers)
const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
const [selectedType, setSelectedType] = useState<number | null>(null);
const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
const [selectedPreference, setSelectedPreference] = useState<number | null>(null);

// Added taxonomy term storage
const [departments, setDepartments] = useState<FilterOption[]>([]);
const [jobTypes, setJobTypes] = useState<FilterOption[]>([]);
const [experienceLevels, setExperienceLevels] = useState<FilterOption[]>([]);
const [jobPreferences, setJobPreferences] = useState<FilterOption[]>([]);
```

**Taxonomy Fetching**:
```tsx
const fetchTaxonomies = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 
                 window.location.origin.replace(':3000', '') + '/wp-json';

  // Fetch all taxonomies in parallel
  const [deptRes, typeRes, levelRes, prefRes] = await Promise.all([
    fetch(`${apiUrl}/wp/v2/career_department?per_page=100`),
    fetch(`${apiUrl}/wp/v2/career_type?per_page=100`),
    fetch(`${apiUrl}/wp/v2/career_level?per_page=100`),
    fetch(`${apiUrl}/wp/v2/career_preference?per_page=100`)
  ]);

  // Calculate counts for each term based on actual career data
  const deptWithCounts = deptData.map((term: TaxonomyTerm) => ({
    ...term,
    count: initialCareers.filter(c => c.career_department?.includes(term.id)).length
  })).filter((term: FilterOption) => term.count > 0);
  
  // Only show terms that have at least one career
};
```

**Correct Filtering Logic**:
```tsx
const applyFilters = () => {
  let filtered = [...allCareers];

  // Filter by taxonomy IDs, not ACF field strings
  if (selectedDepartment !== null) {
    filtered = filtered.filter(c => 
      c.career_department?.includes(selectedDepartment)
    );
  }

  if (selectedType !== null) {
    filtered = filtered.filter(c => 
      c.career_type?.includes(selectedType)
    );
  }

  if (selectedLevel !== null) {
    filtered = filtered.filter(c => 
      c.career_level?.includes(selectedLevel)
    );
  }

  if (selectedPreference !== null) {
    filtered = filtered.filter(c => 
      c.career_preference?.includes(selectedPreference)
    );
  }

  setFilteredCareers(filtered);
};
```

**Added "All" Options**:
```tsx
// Each filter group now has an "All" option
<label 
  className={`${styles.filterOption} ${selectedLevel === null ? styles.active : ''}`}
>
  <input
    type="radio"
    name="level"
    checked={selectedLevel === null}
    onChange={() => handleFilterChange('level', null)}
  />
  <span>All Levels</span>
</label>
```

### 2. Updated Data Flow

**careers/page.tsx**:
- Ensured `career_preference` taxonomy is included in the data mapping
- All taxonomy arrays are properly passed to the component

### 3. Display Logic

**Term Name Resolution**:
```tsx
const getTermName = (termId: number, terms: FilterOption[]): string => {
  const term = terms.find(t => t.id === termId);
  return term?.name || '';
};

// Used in job cards to display taxonomy names
{career.career_department && career.career_department.length > 0 && (
  <span className={styles.jobBadge}>
    {getTermName(career.career_department[0], departments)}
  </span>
)}
```

## How It Works Now

### Data Structure

Each career post has:
```typescript
{
  id: 123,
  title: { rendered: "Full Stack Developer" },
  slug: "full-stack-developer",
  excerpt: { rendered: "..." },
  career_department: [5],      // Array of taxonomy term IDs
  career_type: [8],             // Array of taxonomy term IDs
  career_level: [2],            // Array of taxonomy term IDs
  career_preference: [12],      // Array of taxonomy term IDs
  acf_fields: { ... }           // ACF fields (not used for filtering)
}
```

### Filter Flow

1. **Component Mount**:
   - Fetches all taxonomy terms from WordPress REST API
   - Calculates counts for each term based on actual careers
   - Only displays terms that have at least one career

2. **User Selects Filter**:
   - Updates state with taxonomy term ID (number) or null for "All"
   - Triggers `applyFilters()` via useEffect

3. **Filtering**:
   - Checks if career's taxonomy array includes the selected term ID
   - Multiple filters work together (AND logic)
   - null selection means no filter applied for that category

4. **Display**:
   - Shows filtered careers
   - Displays taxonomy term names in badges
   - Updates job count in real-time

## WordPress Taxonomy Structure

The careers use these taxonomies (registered in functions.php):

- `career_department` - IT, Marketing, Sales, etc.
- `career_type` - Full-Time, Part-Time, Contract, etc.
- `career_level` - Entry Level, Mid-Level, Senior, etc.
- `career_preference` - Remote, On-site, Hybrid, etc.

All are hierarchical taxonomies with REST API support enabled.

## Testing Checklist

- [x] "All Levels" option is clickable and shows all jobs
- [x] Selecting any experience level filters correctly
- [x] Selecting any department filters correctly
- [x] Selecting any job type filters correctly
- [x] Selecting any job preference filters correctly
- [x] Multiple filters work together (AND logic)
- [x] Filter counts are accurate
- [x] Job count updates correctly
- [x] Taxonomy term names display in job cards
- [x] No "No jobs found" error when jobs exist
- [x] Filters reset properly when selecting "All"

## API Endpoints Used

1. `/wp/v2/careers?per_page=100&_embed` - Fetch all careers with taxonomy IDs
2. `/wp/v2/career_department?per_page=100` - Fetch department terms
3. `/wp/v2/career_type?per_page=100` - Fetch job type terms
4. `/wp/v2/career_level?per_page=100` - Fetch experience level terms
5. `/wp/v2/career_preference?per_page=100` - Fetch job preference terms

## Performance Optimizations

1. **Parallel Taxonomy Fetching**: All 4 taxonomies fetched simultaneously using `Promise.all()`
2. **Client-Side Filtering**: Fast filtering without API calls
3. **Count Calculation**: Counts calculated once on mount, not on every filter change
4. **Empty Term Filtering**: Only shows taxonomy terms that have at least one career

## Future Enhancements

- Add loading states for taxonomy fetching
- Cache taxonomy data in localStorage
- Add URL query parameters for shareable filter states
- Add "Clear All Filters" button
- Add filter count badges showing active filters
