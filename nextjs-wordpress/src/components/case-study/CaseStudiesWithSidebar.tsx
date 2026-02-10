'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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

const INITIAL_CARDS = 6;
const CARDS_PER_LOAD = 6;
const INITIAL_LOADING_TIME = 2000; // 3 seconds
const SCROLL_LOADING_DELAY = 600; // milliseconds

const CaseStudiesWithSidebar: React.FC<CaseStudiesWithSidebarProps> = ({
  caseStudies
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [visibleCardsCount, setVisibleCardsCount] = useState(INITIAL_CARDS);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Optimized debounce for search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset visible cards count when filters change
  useEffect(() => {
    setVisibleCardsCount(INITIAL_CARDS);
    setIsInitialLoading(true);
  }, [debouncedSearchQuery, selectedCategories]);

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

  // Get top 4 categories (sorted by count, descending)
  const topCategories = useMemo(() => {
    return [...availableCategories]
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [availableCategories]);

  // Get remaining categories (for dropdown)
  const remainingCategories = useMemo(() => {
    const topCategoryIds = new Set(topCategories.map(cat => cat.id));
    return availableCategories.filter(cat => !topCategoryIds.has(cat.id));
  }, [availableCategories, topCategories]);

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

  // Initial loading: Show 6 cards, then loading for 3 seconds
  useEffect(() => {
    if (isInitialLoading && filteredCaseStudies.length > INITIAL_CARDS) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, INITIAL_LOADING_TIME);

      return () => clearTimeout(timer);
    } else if (filteredCaseStudies.length <= INITIAL_CARDS) {
      setIsInitialLoading(false);
    }
  }, [isInitialLoading, filteredCaseStudies.length]);

  // Lazy loading with Intersection Observer (only after initial loading is done)
  useEffect(() => {
    if (isInitialLoading || visibleCardsCount >= filteredCaseStudies.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore) {
          const currentFilteredCount = filteredCaseStudies.length;
          if (visibleCardsCount < currentFilteredCount) {
            setIsLoadingMore(true);
            // Add delay before loading more cards
            setTimeout(() => {
              setVisibleCardsCount((prev) => {
                const nextCount = prev + CARDS_PER_LOAD;
                setIsLoadingMore(false);
                return Math.min(nextCount, currentFilteredCount);
              });
            }, SCROLL_LOADING_DELAY);
          }
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start loading 200px before reaching the bottom
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [visibleCardsCount, filteredCaseStudies.length, isLoadingMore, isInitialLoading]);

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

  // Handle category selection from dropdown (mobile)
  const handleCategorySelect = useCallback((categoryId: number) => {
    handleCategoryToggle(categoryId);
    setIsCategoryDropdownOpen(false);
  }, [handleCategoryToggle]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories(new Set());
  }, []);

  // Get selected category names for dropdown display
  const selectedCategoryNames = useMemo(() => {
    return availableCategories
      .filter(cat => selectedCategories.has(cat.id))
      .map(cat => cat.name);
  }, [availableCategories, selectedCategories]);

  return (
    <div className="case-studies-with-sidebar">
      {/* Mobile Filter Bar - Only visible on mobile */}
      <div className="mobile-filter-bar">
        {/* Search Input */}
        <div className="mobile-search-wrapper">
          <svg className="mobile-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search case studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mobile-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mobile-clear-search-btn"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="mobile-category-dropdown-wrapper">
          <button
            className={`mobile-category-dropdown-btn ${selectedCategories.size > 0 ? 'badge-active' : ''}`}
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            aria-label="Select category"
          >
            <span className="mobile-dropdown-label">
              {selectedCategoryNames.length > 0 
                ? `${selectedCategoryNames.length} Selected` 
                : 'All Categories'}
            </span>
            <svg 
              className={`mobile-dropdown-arrow ${isCategoryDropdownOpen ? 'open' : ''}`}
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {isCategoryDropdownOpen && (
            <>
              <div 
                className="mobile-dropdown-overlay"
                onClick={() => setIsCategoryDropdownOpen(false)}
              />
              <div className="mobile-category-dropdown">
                <div className="mobile-dropdown-drag-handle"></div>
                <div className="mobile-dropdown-header">
                  <h3>Select Categories</h3>
                  {selectedCategories.size > 0 && (
                    <button onClick={clearFilters} className="mobile-clear-all-btn">
                      Clear All
                    </button>
                  )}
                </div>
                <div className="mobile-dropdown-list">
                  {availableCategories.length > 0 ? (
                    availableCategories.map((category) => (
                      <button
                        key={category.id}
                        className={`mobile-dropdown-item ${selectedCategories.has(category.id) ? 'selected' : ''}`}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <span className="mobile-dropdown-checkbox">
                          {selectedCategories.has(category.id) && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <span className="mobile-dropdown-name">{category.name}</span>
                        <span className="mobile-dropdown-count">({category.count})</span>
                      </button>
                    ))
                  ) : (
                    <div className="mobile-no-categories">
                      <p>No categories found</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Filter Bar - Only visible on desktop */}
      <div className="filter-bar">
        {/* Top 4 Category Badges */}
        <div className="category-badges-container">
          {topCategories.map((category) => (
            <button
              key={category.id}
              className={`category-badge ${selectedCategories.has(category.id) ? 'active' : ''}`}
              onClick={() => handleCategoryToggle(category.id)}
              aria-label={`Filter by ${category.name}`}
            >
              <span className="badge-name">{category.name}</span>
              <span className="badge-count">({category.count})</span>
            </button>
          ))}
        </div>

        {/* All Categories Dropdown Button */}
        <div className="category-dropdown-wrapper">
            <button
              className={`category-dropdown-btn ${selectedCategories.size > topCategories.filter(c => selectedCategories.has(c.id)).length ? 'has-selection' : ''}`}
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              aria-label="Select more categories"
            >
              <span className="dropdown-label">All Categories</span>
              <svg 
                className={`dropdown-arrow ${isCategoryDropdownOpen ? 'open' : ''}`}
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isCategoryDropdownOpen && (
              <>
                <div 
                  className="dropdown-overlay"
                  onClick={() => setIsCategoryDropdownOpen(false)}
                />
                <div className="category-dropdown">
                  <div className="dropdown-header">
                    <h3>All Categories</h3>
                    {selectedCategories.size > 0 && (
                      <button onClick={clearFilters} className="clear-all-btn">
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="dropdown-list">
                    {availableCategories.length > 0 ? (
                      availableCategories.map((category) => (
                        <button
                          key={category.id}
                          className={`dropdown-item ${selectedCategories.has(category.id) ? 'selected' : ''}`}
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <span className="dropdown-checkbox">
                            {selectedCategories.has(category.id) && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                          <span className="dropdown-name">{category.name}</span>
                          <span className="dropdown-count">({category.count})</span>
                        </button>
                      ))
                    ) : (
                      <div className="no-categories">
                        <p>No categories found</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

        {/* Search Input */}
        <div className="search-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search case studies..."
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

      <div className="filter-wrapper">
        <div className="case-studies-layout-container">
        {/* Left Sidebar */}
       

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
                {filteredCaseStudies.slice(0, visibleCardsCount).map((caseStudy) => (
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
              
              {/* Initial Loading Indicator (after 6 cards for 3 seconds) */}
              {isInitialLoading && filteredCaseStudies.length > INITIAL_CARDS && (
                <div className="loading-indicator">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading case studies...</p>
                </div>
              )}
              
              {/* Lazy Loading Trigger and Indicator */}
              {!isInitialLoading && visibleCardsCount < filteredCaseStudies.length && (
                <div ref={loadMoreRef} className="load-more-trigger">
                  {isLoadingMore && (
                    <div className="loading-indicator">
                      <div className="loading-spinner"></div>
                      <p className="loading-text">Loading more case studies...</p>
                    </div>
                  )}
                </div>
              )}
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

        /* Mobile Filter Bar - Hidden on Desktop */
        .mobile-filter-bar {
          display: none;
        }

        /* Desktop Filter Bar - Visible on Desktop */
        .filter-bar {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          padding: 0;
          width: 100%;
          flex-wrap: wrap;
        }

        /* Category Badges Container */
        .category-badges-container {
          display: flex;
          flex-direction: row;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
          min-width: 0;
        }

        /* Category Badge */
        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          background: #ffffff;
          color: #374151;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-sizing: border-box;
        }

        .category-badge:hover {
          border-color: #0891b2;
          background: #ecfeff;
          color: #0891b2;
          transform: translateY(-1px);
        }

        .category-badge.active {
          background: #0891b2;
          border-color: #0891b2;
          color: #ffffff;
        }

        .category-badge.active:hover {
          background: #0e7490;
          border-color: #0e7490;
        }

        .badge-name {
          font-weight: 600;
        }

        .badge-count {
          font-size: 0.85rem;
          opacity: 0.8;
          font-weight: 500;
        }

        /* Category Dropdown Wrapper */
        .category-dropdown-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .category-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 2px solid #0891b2;
          border-radius: 8px;
          background: #ffffff;
          color: #0891b2;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-sizing: border-box;
        }

        .category-dropdown-btn:hover {
          background: #ecfeff;
          transform: translateY(-1px);
        }

        .category-dropdown-btn.has-selection {
          background: #0891b2;
          color: #ffffff;
        }

        .category-dropdown-btn.has-selection:hover {
          background: #0e7490;
          border-color: #0e7490;
        }

        .dropdown-label {
          font-weight: 600;
        }

        .dropdown-arrow {
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .dropdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999;
        }

        .category-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 320px;
          max-width: 90vw;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          max-height: 400px;
          overflow: hidden;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: #ffffff;
          z-index: 1;
        }

        .dropdown-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .clear-all-btn {
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

        .clear-all-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #374151;
        }

        .dropdown-list {
          max-height: 320px;
          overflow-y: auto;
          padding: 8px 0;
        }

        .dropdown-item {
          width: 100%;
          padding: 12px 20px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        .dropdown-item:hover {
          background: #f9fafb;
        }

        .dropdown-item.selected {
          background: #ecfeff;
        }

        .dropdown-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .dropdown-item.selected .dropdown-checkbox {
          background: #0891b2;
          border-color: #0891b2;
          color: white;
        }

        .dropdown-name {
          flex: 1;
          color: #374151;
          font-weight: 500;
        }

        .dropdown-item.selected .dropdown-name {
          color: #0891b2;
          font-weight: 600;
        }

        .dropdown-count {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        /* Search Wrapper */
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 200px;
          max-width: 400px;
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
          padding: 10px 40px 10px 40px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: #f9fafb;
          box-sizing: border-box;
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
            grid-template-columns: repeat(3, 1fr);
         gap: 20px;
        }

        /* Loading Indicator */
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px 20px;
          margin-top: 40px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #0891b2;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          color: #6b7280;
          font-size: 0.95rem;
          font-weight: 500;
          margin: 0;
        }

        .load-more-trigger {
          margin-top: 40px;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
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

          .case-studies-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          /* Fix overflow on mobile screens only */
          .case-studies-with-sidebar {
            overflow-x: hidden;
            max-width: 100%;
          }

          .filter-wrapper {
            width: 100% !important;
            max-width: 100%;
            overflow-x: hidden;
          }

          /* Hide Desktop Filter Bar on Mobile */
          .filter-bar {
            display: none;
          }

          /* Show Mobile Filter Bar on Mobile */
          .mobile-filter-bar {
            display: flex;
            flex-direction: row;
            gap: 10px;
            margin-bottom: 20px;
            padding: 0;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            align-items: stretch;
          }

          .mobile-search-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            flex: 1;
            min-width: 0;
          }

          .mobile-search-icon {
            position: absolute;
            left: 12px;
            color: #6b7280;
            pointer-events: none;
            z-index: 1;
          }

          .mobile-search-input {
            width: 100%;
            padding: 12px 38px 12px 38px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            background: #f9fafb;
            box-sizing: border-box;
          }

          .mobile-search-input:focus {
            outline: none;
            border-color: #0891b2;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
          }

          .mobile-clear-search-btn {
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

          .mobile-clear-search-btn:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .mobile-category-dropdown-wrapper {
            position: relative;
            flex-shrink: 0;
            width: auto;
            min-width: 140px;
            max-width: 180px;
            box-sizing: border-box;
          }

          .mobile-category-dropdown-btn {
            width: 100%;
            height: 100%;
            padding: 12px 14px;
            border: 2px solid #0891b2;
            border-radius: 20px;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.85rem;
            font-weight: 600;
            color: #0891b2;
            white-space: nowrap;
            box-sizing: border-box;
          }

          .mobile-category-dropdown-btn.badge-active {
            background: #0891b2;
            color: #ffffff;
          }

          .mobile-category-dropdown-btn:hover {
            background: #ecfeff;
            border-color: #0891b2;
            transform: scale(1.02);
          }

          .mobile-category-dropdown-btn.badge-active:hover {
            background: #0e7490;
            border-color: #0e7490;
          }

          .mobile-dropdown-label {
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            min-width: 0;
          }

          .mobile-dropdown-arrow {
            color: inherit;
            transition: transform 0.3s ease;
            flex-shrink: 0;
            width: 16px;
            height: 16px;
          }

          .mobile-dropdown-arrow.open {
            transform: rotate(180deg);
          }

          .mobile-dropdown-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 999;
          }

          .mobile-category-dropdown {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100vw;
            max-width: 100vw;
            background: #ffffff;
            border-top: 2px solid #e5e7eb;
            border-left: none;
            border-right: none;
            border-bottom: none;
            border-radius: 16px 16px 0 0;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            max-height: 70vh;
            overflow-y: auto;
            overflow-x: hidden;
            box-sizing: border-box;
            transform: translateY(0);
            animation: slideUp 0.3s ease-out;
          }

          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .mobile-dropdown-drag-handle {
            width: 40px;
            height: 4px;
            background: #d1d5db;
            border-radius: 2px;
            margin: 12px auto 8px;
            cursor: grab;
          }

          .mobile-dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #e5e7eb;
            box-sizing: border-box;
            position: sticky;
            top: 0;
            background: #ffffff;
            z-index: 1;
          }

          .mobile-dropdown-header h3 {
            font-size: 1rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
          }

          .mobile-clear-all-btn {
            padding: 4px 12px;
            background: transparent;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .mobile-clear-all-btn:hover {
            background: #f3f4f6;
            border-color: #d1d5db;
            color: #374151;
          }

          .mobile-dropdown-list {
            max-height: calc(70vh - 80px);
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 20px;
          }

          .mobile-dropdown-item {
            width: 100%;
            padding: 12px 16px;
            border: none;
            background: transparent;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
            font-size: 0.95rem;
            box-sizing: border-box;
          }

          .mobile-dropdown-item:hover {
            background: #f9fafb;
          }

          .mobile-dropdown-item.selected {
            background: #ecfeff;
          }

          .mobile-dropdown-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #d1d5db;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s ease;
          }

          .mobile-dropdown-item.selected .mobile-dropdown-checkbox {
            background: #0891b2;
            border-color: #0891b2;
            color: white;
          }

          .mobile-dropdown-name {
            flex: 1;
            color: #374151;
            font-weight: 500;
          }

          .mobile-dropdown-item.selected .mobile-dropdown-name {
            color: #0891b2;
            font-weight: 600;
          }

          .mobile-dropdown-count {
            font-size: 0.85rem;
            color: #6b7280;
            font-weight: 500;
          }

          .mobile-no-categories {
            padding: 20px;
            text-align: center;
            color: #6b7280;
          }

          /* Hide sidebar completely on mobile */
          .filter-sidebar {
            display: none !important;
          }

          .case-studies-layout-container {
            gap: 0;
            flex-direction: column;
            align-items: stretch;
            padding-top: 0;
          }

          .case-studies-content {
            flex: 1;
            min-width: 0;
            width: 100%;
          }

          .case-studies-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .load-more-trigger {
            margin-top: 30px;
            min-height: 80px;
          }

          .loading-indicator {
            padding: 30px 15px;
            gap: 12px;
            margin-top: 30px;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border-width: 3px;
          }

          .loading-text {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .mobile-filter-bar {
            gap: 8px;
            margin-bottom: 15px;
          }

          .mobile-search-wrapper {
            flex: 1;
          }

          .mobile-search-input {
            padding: 10px 34px 10px 34px;
            font-size: 0.85rem;
          }

          .mobile-search-icon {
            width: 16px;
            height: 16px;
            left: 10px;
          }

          .mobile-category-dropdown-wrapper {
            min-width: 120px;
            max-width: 160px;
          }

          .mobile-category-dropdown-btn {
            padding: 10px 12px;
            font-size: 0.8rem;
          }

          .mobile-dropdown-label {
            font-size: 0.8rem;
          }

          .mobile-dropdown-arrow {
            width: 14px;
            height: 14px;
          }

          .mobile-category-dropdown {
            max-height: 65vh;
          }

          .mobile-dropdown-list {
            max-height: calc(65vh - 80px);
          }

          .mobile-dropdown-header h3 {
            font-size: 0.95rem;
          }

          .mobile-dropdown-item {
            padding: 10px 14px;
            font-size: 0.9rem;
          }

          .mobile-dropdown-checkbox {
            width: 18px;
            height: 18px;
          }

          .mobile-dropdown-name {
            font-size: 0.9rem;
          }

          .mobile-dropdown-count {
            font-size: 0.8rem;
          }

          .case-studies-grid {
            gap: 15px;
          }

          .results-count {
            font-size: 0.8rem;
            margin-bottom: 12px;
          }

          .load-more-trigger {
            margin-top: 25px;
            min-height: 70px;
          }

          .loading-indicator {
            padding: 25px 12px;
            gap: 10px;
            margin-top: 25px;
          }

          .loading-spinner {
            width: 36px;
            height: 36px;
            border-width: 3px;
          }

          .loading-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudiesWithSidebar;

