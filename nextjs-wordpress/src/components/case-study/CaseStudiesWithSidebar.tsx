'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import CaseStudyCard from './CaseStudyCard';

interface ProcessedCaseStudyData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featured_image: string | null;
  blocks: any[];
  acf_fields: any;
  categories?: number[];
  _embedded?: any;
}

interface CaseStudiesWithSidebarProps {
  caseStudies: ProcessedCaseStudyData[];
}

const CaseStudiesWithSidebar: React.FC<CaseStudiesWithSidebarProps> = ({
  caseStudies
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile

  // Optimized debounce for search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Extract ALL categories from case studies
  const availableCategories = useMemo(() => {
    const categoryMap = new Map<number, { id: number; name: string; slug: string; count: number }>();
    
    caseStudies.forEach(caseStudy => {
      const processedCategories = new Set<number>(); // Track processed categories for this case study
      
      // First, check embedded terms to get category names and IDs
      if (caseStudy._embedded && caseStudy._embedded['wp:term']) {
        const terms = caseStudy._embedded['wp:term'];
        if (Array.isArray(terms)) {
          terms.forEach((taxonomyTerms: any[]) => {
            if (Array.isArray(taxonomyTerms)) {
              taxonomyTerms.forEach((term: any) => {
                if (term && (term.taxonomy === 'category' || term.taxonomy === undefined)) {
                  const termId = term.id || term.term_id;
                  const termName = term.name || '';
                  const termSlug = term.slug || '';
                  
                  if (termId && termName && termName !== 'Uncategorized' && !processedCategories.has(termId)) {
                    processedCategories.add(termId);
                    const existing = categoryMap.get(termId) || { 
                      id: termId, 
                      name: termName, 
                      slug: termSlug, 
                      count: 0 
                    };
                    existing.count++;
                    categoryMap.set(termId, existing);
                  }
                }
              });
            }
          });
        }
      }
      
      // Then check categories array for any categories not already processed
      if (caseStudy.categories && Array.isArray(caseStudy.categories)) {
        caseStudy.categories.forEach((catId: number) => {
          if (!processedCategories.has(catId)) {
            processedCategories.add(catId);
            let catName = `Category ${catId}`;
            let catSlug = `category-${catId}`;
            
            // Try to find the name from embedded terms
            if (caseStudy._embedded && caseStudy._embedded['wp:term']) {
              const terms = caseStudy._embedded['wp:term'];
              if (Array.isArray(terms)) {
                terms.forEach((taxonomyTerms: any[]) => {
                  if (Array.isArray(taxonomyTerms)) {
                    const foundTerm = taxonomyTerms.find((t: any) => 
                      (t.id === catId || t.term_id === catId) && 
                      (t.taxonomy === 'category' || t.taxonomy === undefined)
                    );
                    if (foundTerm && foundTerm.name !== 'Uncategorized') {
                      catName = foundTerm.name || catName;
                      catSlug = foundTerm.slug || catSlug;
                    }
                  }
                });
              }
            }
            
            const existing = categoryMap.get(catId) || { 
              id: catId, 
              name: catName, 
              slug: catSlug, 
              count: 0 
            };
            existing.count++;
            categoryMap.set(catId, existing);
          }
        });
      }
    });
    
    return Array.from(categoryMap.values())
      .filter(cat => cat.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [caseStudies]);

  // Filter categories based on search query (same search for both)
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return availableCategories;
    }
    
    const query = debouncedSearchQuery.toLowerCase();
    return availableCategories.filter(cat => 
      cat.name.toLowerCase().includes(query)
    );
  }, [availableCategories, debouncedSearchQuery]);

  // Filter case studies based on search query and selected categories
  const filteredCaseStudies = useMemo(() => {
    let filtered = caseStudies;

    // Filter by search query (searches in title, excerpt, content)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(caseStudy => 
        caseStudy.title.toLowerCase().includes(query) ||
        caseStudy.excerpt.toLowerCase().includes(query) ||
        caseStudy.content.toLowerCase().includes(query)
      );
    }

    // Filter by selected categories
    if (selectedCategories.size > 0) {
      filtered = filtered.filter(caseStudy => {
        // Check embedded terms
        if (caseStudy._embedded && caseStudy._embedded['wp:term']) {
          const terms = caseStudy._embedded['wp:term'];
          if (Array.isArray(terms)) {
            for (const taxonomyTerms of terms) {
              if (Array.isArray(taxonomyTerms)) {
                const hasCategory = taxonomyTerms.some((term: any) => {
                  const isCategory = term.taxonomy === 'category' || term.taxonomy === undefined;
                  const termId = term.id || term.term_id;
                  return isCategory && selectedCategories.has(termId);
                });
                if (hasCategory) return true;
              }
            }
          }
        }
        
        // Check categories array
        if (caseStudy.categories && Array.isArray(caseStudy.categories)) {
          return caseStudy.categories.some((catId: number) => 
            selectedCategories.has(catId)
          );
        }

        return false;
      });
    }

    return filtered;
  }, [caseStudies, debouncedSearchQuery, selectedCategories]);

  // Handle category toggle
  const handleCategoryToggle = useCallback((categoryId: number) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories(new Set());
  }, []);

  return (
    <div className="case-studies-with-sidebar">
      <div className="filter-wrapper">
        {/* Filter Toggle Button - Mobile Only */}
        <button 
          className={`filter-toggle-btn ${isSidebarOpen ? 'open' : 'closed'}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Close filter sidebar' : 'Open filter sidebar'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="7" cy="6" r="2" fill="currentColor"/>
            <circle cx="17" cy="12" r="2" fill="currentColor"/>
            <circle cx="7" cy="18" r="2" fill="currentColor"/>
          </svg>
        </button>

        <div className="case-studies-layout-container">
        {/* Left Sidebar */}
        <aside className={`filter-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="sidebar-container">
            {/* Single Search Box - Works for both categories and case studies */}
            <div className="search-section">
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search categories & case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="clear-search-btn"
                    aria-label="Clear search"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div className="categories-section">
              <div className="categories-header">
                <h3 className="categories-title">Categories</h3>
                {(selectedCategories.size > 0 || searchQuery) && (
                  <button onClick={clearFilters} className="clear-filters-btn">
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories List with Checkboxes */}
              <div className="categories-list">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <label
                      key={category.id}
                      className={`category-checkbox-label ${selectedCategories.has(category.id) ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="category-checkbox"
                      />
                      <span className="checkbox-custom"></span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">({category.count})</span>
                    </label>
                  ))
                ) : (
                  <div className="no-categories">
                    <p>No categories found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="case-studies-content">
          {filteredCaseStudies.length > 0 ? (
            <>
              {(debouncedSearchQuery || selectedCategories.size > 0) && (
                <div className="results-count">
                  Showing {filteredCaseStudies.length} of {caseStudies.length} case studies
                </div>
              )}
              <div className="case-studies-grid">
                {filteredCaseStudies.map((caseStudy) => (
                  <CaseStudyCard
                    key={caseStudy.id}
                    id={caseStudy.id}
                    title={caseStudy.title}
                    slug={caseStudy.slug}
                    excerpt={caseStudy.excerpt}
                    featured_image={caseStudy.featured_image ?? null}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No case studies found</h3>
              <p>Try adjusting your search or filters.</p>
              {(searchQuery || selectedCategories.size > 0) && (
                <button onClick={clearFilters} className="reset-filters-btn">
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      </div>

      <style jsx>{`
        .case-studies-with-sidebar {
          width: 100%;
          position: relative;
        }

        .filter-wrapper {
          position: relative;
          width: 100%;
        }

        /* Filter Toggle Button - Hidden on Desktop, Visible on Mobile */
        .filter-toggle-btn {
          display: none;
        }

        .case-studies-layout-container {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }

        /* Left Sidebar */
        .filter-sidebar {
          flex-shrink: 0;
          width: 320px;
          position: sticky;
          top: 20px;
          align-self: flex-start;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-container {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          min-height: calc(100vh - 100px);
          display: flex;
          flex-direction: column;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 24px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #6b7280;
          pointer-events: none;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 40px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: #f9fafb;
        }

        .search-input:focus {
          outline: none;
          border-color: #0891b2;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
        }

        .clear-search-btn {
          position: absolute;
          right: 8px;
          padding: 4px;
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          z-index: 1;
        }

        .clear-search-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        /* Categories Section */
        .categories-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 24px;
        }

        .categories-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .categories-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .clear-filters-btn {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-filters-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #374151;
        }

        .categories-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 0;
        }

        .categories-list::-webkit-scrollbar {
          width: 6px;
        }

        .categories-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .categories-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .categories-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .category-checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .category-checkbox-label:hover {
          background: #f9fafb;
        }

        .category-checkbox-label.checked {
          background: #ecfeff;
        }

        .category-checkbox {
          display: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .category-checkbox:checked + .checkbox-custom {
          background: #0891b2;
          border-color: #0891b2;
        }

        .category-checkbox:checked + .checkbox-custom::after {
          content: '✓';
          color: white;
          font-size: 14px;
          font-weight: bold;
        }

        .category-name {
          flex: 1;
          font-size: 0.95rem;
          color: #374151;
          font-weight: 500;
        }

        .category-checkbox-label.checked .category-name {
          color: #0891b2;
          font-weight: 600;
        }

        .category-count {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        .no-categories {
          padding: 20px;
          text-align: center;
          color: #6b7280;
        }

        /* Main Content */
        .case-studies-content {
          flex: 1;
          min-width: 0;
        }

        .results-count {
          margin-bottom: 20px;
          font-size: 0.95rem;
          color: #6b7280;
          font-weight: 500;
        }

        .case-studies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 80px 20px;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-results h3 {
          font-size: 1.75rem;
          color: #1e293b;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .no-results p {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 30px;
        }

        .reset-filters-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(8, 145, 178, 0.25);
        }

        .reset-filters-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(8, 145, 178, 0.35);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .case-studies-layout-container {
            gap: 25px;
          }

          .filter-sidebar {
            width: 280px;
          }

          .sidebar-container {
            min-height: calc(100vh - 120px);
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          /* Show Toggle Button on Mobile */
          .filter-toggle-btn {
            display: flex;
            position: absolute;
            left: 10px;
            top: -6px;
            z-index: 1001;
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(8, 145, 178, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .filter-toggle-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(8, 145, 178, 0.5);
          }

          .case-studies-layout-container {
            gap: 15px;
            flex-direction: row;
            align-items: flex-start;
            padding-top: 50px;
          }

          .filter-sidebar {
            width: 240px;
            flex-shrink: 0;
            position: sticky;
            top: 10px;
          }

          .filter-sidebar.sidebar-open {
            opacity: 1;
            transform: translateX(0);
            pointer-events: auto;
            visibility: visible;
          }

          .filter-sidebar.sidebar-closed {
            opacity: 0;
            transform: translateX(-100%);
            pointer-events: none;
            visibility: hidden;
            width: 0;
            margin-right: 0;
            overflow: hidden;
          }

          .case-studies-content {
            flex: 1;
            min-width: 0;
          }

          .sidebar-container {
            min-height: calc(100vh - 140px);
            padding: 16px;
            max-height: calc(100vh - 140px);
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .categories-section {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .categories-list {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
          }

          .case-studies-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          /* Toggle Button for Small Mobile */
          .filter-toggle-btn {
            left: 5px;
            top: -6px;
            width: 40px;
            height: 40px;
            border-radius: 8px;
          }

          .case-studies-layout-container {
            gap: 12px;
            flex-direction: row;
            padding-top: 45px;
          }

          .filter-sidebar {
            width: 200px;
          }

          .filter-sidebar.sidebar-closed {
            width: 0;
          }

          .sidebar-container {
            padding: 12px;
            border-radius: 8px;
            min-height: calc(100vh - 120px);
            max-height: calc(100vh - 120px);
          }

          .search-input {
            padding: 8px 32px 8px 32px;
            font-size: 0.85rem;
          }

          .search-icon {
            width: 16px;
            height: 16px;
            left: 10px;
          }

          .categories-title {
            font-size: 0.95rem;
          }

          .category-checkbox-label {
            padding: 8px 8px;
            gap: 8px;
          }

          .checkbox-custom {
            width: 18px;
            height: 18px;
          }

          .category-name {
            font-size: 0.85rem;
          }

          .category-count {
            font-size: 0.75rem;
          }

          .categories-list {
            gap: 6px;
          }

          .case-studies-grid {
            gap: 15px;
          }

          .results-count {
            font-size: 0.8rem;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudiesWithSidebar;

