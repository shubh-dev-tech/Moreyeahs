'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CareersWithSidebar.module.css';

interface TaxonomyTerm {
  id: number;
  name: string;
  slug: string;
}

interface CareerData {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
  excerpt: {
    rendered: string;
  };
  acf_fields?: {
    job_type?: string;
    department?: string;
    location?: string;
    experience_level?: string;
  };
  career_department?: number[];
  career_type?: number[];
  career_level?: number[];
  career_preference?: number[];
}

interface CareersWithSidebarProps {
  careers: CareerData[];
}

interface FilterOption {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const CareersWithSidebar: React.FC<CareersWithSidebarProps> = ({ careers: initialCareers }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedPreference, setSelectedPreference] = useState<number | null>(null);
  const [filteredCareers, setFilteredCareers] = useState<CareerData[]>(initialCareers);
  const [allCareers, setAllCareers] = useState<CareerData[]>(initialCareers);
  const [isLoading, setIsLoading] = useState(false);
  
  // Taxonomy terms
  const [departments, setDepartments] = useState<FilterOption[]>([]);
  const [jobTypes, setJobTypes] = useState<FilterOption[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<FilterOption[]>([]);
  const [jobPreferences, setJobPreferences] = useState<FilterOption[]>([]);

  // Fetch taxonomy terms on component mount
  useEffect(() => {
    fetchTaxonomies();
  }, []);

  // Apply filters whenever selection changes
  useEffect(() => {
    applyFilters();
  }, [selectedDepartment, selectedType, selectedLevel, selectedPreference, allCareers]);

  // Fetch all taxonomy terms from WordPress
  const fetchTaxonomies = async () => {
    try {
      // Use the environment utility to get the correct API URL
      const { getWordPressApiUrl } = await import('@/lib/environment');
      const apiUrl = getWordPressApiUrl();

      // Fetch all taxonomies in parallel
      const [deptRes, typeRes, levelRes, prefRes] = await Promise.all([
        fetch(`${apiUrl}/wp/v2/career_department?per_page=50`),
        fetch(`${apiUrl}/wp/v2/career_type?per_page=50`),
        fetch(`${apiUrl}/wp/v2/career_level?per_page=50`),
        fetch(`${apiUrl}/wp/v2/career_preference?per_page=50`)
      ]);

      const [deptData, typeData, levelData, prefData] = await Promise.all([
        deptRes.json(),
        typeRes.json(),
        levelRes.json(),
        prefRes.json()
      ]);

      // Calculate counts for each taxonomy term
      const deptWithCounts = deptData.map((term: TaxonomyTerm) => ({
        ...term,
        count: initialCareers.filter(c => c.career_department?.includes(term.id)).length
      })).filter((term: FilterOption) => term.count > 0);

      const typeWithCounts = typeData.map((term: TaxonomyTerm) => ({
        ...term,
        count: initialCareers.filter(c => c.career_type?.includes(term.id)).length
      })).filter((term: FilterOption) => term.count > 0);

      const levelWithCounts = levelData.map((term: TaxonomyTerm) => ({
        ...term,
        count: initialCareers.filter(c => c.career_level?.includes(term.id)).length
      })).filter((term: FilterOption) => term.count > 0);

      const prefWithCounts = prefData.map((term: TaxonomyTerm) => ({
        ...term,
        count: initialCareers.filter(c => c.career_preference?.includes(term.id)).length
      })).filter((term: FilterOption) => term.count > 0);

      setDepartments(deptWithCounts);
      setJobTypes(typeWithCounts);
      setExperienceLevels(levelWithCounts);
      setJobPreferences(prefWithCounts);
    } catch (error) {
      console.error('Error fetching taxonomies:', error);
    }
  };

  // Apply filters to careers
  const applyFilters = () => {
    setIsLoading(true);
    
    try {
      let filtered = [...allCareers];

      // Apply department filter
      if (selectedDepartment !== null) {
        filtered = filtered.filter(c => 
          c.career_department?.includes(selectedDepartment)
        );
      }

      // Apply job type filter
      if (selectedType !== null) {
        filtered = filtered.filter(c => 
          c.career_type?.includes(selectedType)
        );
      }

      // Apply experience level filter
      if (selectedLevel !== null) {
        filtered = filtered.filter(c => 
          c.career_level?.includes(selectedLevel)
        );
      }

      // Apply job preference filter
      if (selectedPreference !== null) {
        filtered = filtered.filter(c => 
          c.career_preference?.includes(selectedPreference)
        );
      }

      setFilteredCareers(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredCareers(allCareers);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes - toggle on/off
  const handleFilterChange = (filterType: string, value: number) => {
    switch (filterType) {
      case 'department':
        setSelectedDepartment(selectedDepartment === value ? null : value);
        break;
      case 'type':
        setSelectedType(selectedType === value ? null : value);
        break;
      case 'level':
        setSelectedLevel(selectedLevel === value ? null : value);
        break;
      case 'preference':
        setSelectedPreference(selectedPreference === value ? null : value);
        break;
    }
  };

  // Handle clicking on filter heading to clear that filter
  const handleClearFilter = (filterType: string) => {
    switch (filterType) {
      case 'department':
        setSelectedDepartment(null);
        break;
      case 'type':
        setSelectedType(null);
        break;
      case 'level':
        setSelectedLevel(null);
        break;
      case 'preference':
        setSelectedPreference(null);
        break;
    }
  };

  const getRenderedTitle = (career: CareerData): string => {
    return career.title?.rendered || '';
  };

  const getRenderedExcerpt = (career: CareerData): string => {
    const excerpt = career.excerpt?.rendered || '';
    // Sanitize and ensure valid HTML
    if (!excerpt) return '';
    try {
      // Remove any potentially problematic HTML
      return excerpt.trim();
    } catch (error) {
      console.error('Error processing excerpt:', error);
      return '';
    }
  };

  // Get display name for taxonomy term
  const getTermName = (termId: number, terms: FilterOption[]): string => {
    const term = terms.find(t => t.id === termId);
    return term?.name || '';
  };

  return (
    <div className={styles.careersContainer}>
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Filters</h2>

        {/* Experience Level Filter */}
        <div className={styles.filterGroup}>
          <h3 
            className={`${styles.filterTitle} ${styles.clickableTitle}`}
            onClick={() => handleClearFilter('level')}
            title="Click to show all experience levels"
          >
            All Experience Level ({experienceLevels.reduce((sum, item) => sum + item.count, 0)})
          </h3>
          <div className={styles.filterOptions}>
            {experienceLevels.map((levelOption) => (
              <div 
                key={levelOption.id} 
                className={`${styles.filterOption} ${selectedLevel === levelOption.id ? styles.active : ''}`}
                onClick={() => handleFilterChange('level', levelOption.id)}
              >
                <span>{levelOption.name} ({levelOption.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Filter */}
        <div className={styles.filterGroup}>
          <h3 
            className={`${styles.filterTitle} ${styles.clickableTitle}`}
            onClick={() => handleClearFilter('department')}
            title="Click to show all positions"
          >
            All positions ({departments.reduce((sum, item) => sum + item.count, 0)})
          </h3>
          <div className={styles.filterOptions}>
            {departments.map((deptOption) => (
              <div 
                key={deptOption.id} 
                className={`${styles.filterOption} ${selectedDepartment === deptOption.id ? styles.active : ''}`}
                onClick={() => handleFilterChange('department', deptOption.id)}
              >
                <span>{deptOption.name} ({deptOption.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Job Type Filter */}
        <div className={styles.filterGroup}>
          <h3 
            className={`${styles.filterTitle} ${styles.clickableTitle}`}
            onClick={() => handleClearFilter('type')}
            title="Click to show all job types"
          >
            All Job Type ({jobTypes.reduce((sum, item) => sum + item.count, 0)})
          </h3>
          <div className={styles.filterOptions}>
            {jobTypes.map((typeOption) => (
              <div 
                key={typeOption.id} 
                className={`${styles.filterOption} ${selectedType === typeOption.id ? styles.active : ''}`}
                onClick={() => handleFilterChange('type', typeOption.id)}
              >
                <span>{typeOption.name} ({typeOption.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Job Preference Filter */}
        <div className={styles.filterGroup}>
          <h3 
            className={`${styles.filterTitle} ${styles.clickableTitle}`}
            onClick={() => handleClearFilter('preference')}
            title="Click to show all job preferences"
          >
            All Job Preference ({jobPreferences.reduce((sum, item) => sum + item.count, 0)})
          </h3>
          <div className={styles.filterOptions}>
            {jobPreferences.map((prefOption) => (
              <div 
                key={prefOption.id} 
                className={`${styles.filterOption} ${selectedPreference === prefOption.id ? styles.active : ''}`}
                onClick={() => handleFilterChange('preference', prefOption.id)}
              >
                <span>{prefOption.name} ({prefOption.count})</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Job Listings */}
      <main className={styles.jobListings}>
        <h2 className={styles.jobListingsTitle}>
          Job Openings ({filteredCareers.length})
        </h2>

        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>Loading jobs...</p>
          </div>
        )}

        {!isLoading && filteredCareers.length === 0 ? (
          <p className={styles.noResults}>No jobs found matching your filters.</p>
        ) : (
          <div className={`${styles.jobList} ${isLoading ? styles.loading : ''}`}>
            {filteredCareers.map((career) => {
              // Get taxonomy term names
              const deptName = career.career_department && career.career_department.length > 0 
                ? getTermName(career.career_department[0], departments) 
                : '';
              const typeName = career.career_type && career.career_type.length > 0 
                ? getTermName(career.career_type[0], jobTypes) 
                : '';
              
              // Ensure we have valid data before rendering
              if (!career.id || !career.slug) {
                return null;
              }
              
              return (
                <Link key={`career-${career.id}`} href={`/careers/${career.slug}`} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <h3 className={styles.jobTitle}>
                      {getRenderedTitle(career)}
                    </h3>
                    <div className={styles.jobMeta}>
                      {deptName && (
                        <span className={styles.jobBadge}>
                          {deptName}
                        </span>
                      )}
                      {typeName && (
                        <span className={styles.jobBadge}>
                          {typeName}
                        </span>
                      )}
                    </div>
                  </div>
                  {getRenderedExcerpt(career) && (
                    <div 
                      className={styles.jobExcerpt}
                      dangerouslySetInnerHTML={{ __html: getRenderedExcerpt(career) }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CareersWithSidebar;
