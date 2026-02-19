'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<Set<number>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [visibleCardsCount, setVisibleCardsCount] = useState(INITIAL_CARDS);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isIndustriesCollapsed, setIsIndustriesCollapsed] = useState(false);
  const [isCategoriesCollapsed, setIsCategoriesCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

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
  }, [debouncedSearchQuery, selectedIndustries, selectedCategories]);

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

  // Extract ALL industries from case studies
  const availableIndustries = useMemo(() => {
    const industryMap = new Map<number, { id: number; name: string; slug: string; count: number }>();
    
    caseStudies.forEach(caseStudy => {
      const processedIndustries = new Set<number>(); // Track processed industries for this case study
      
      // Check embedded terms to get industry names and IDs
      if (caseStudy._embedded && caseStudy._embedded['wp:term']) {
        const terms = caseStudy._embedded['wp:term'];
        if (Array.isArray(terms)) {
          terms.forEach((taxonomyTerms: any[]) => {
            if (Array.isArray(taxonomyTerms)) {
              taxonomyTerms.forEach((term: any) => {
                if (term && term.taxonomy === 'industry') {
                  const termId = term.id || term.term_id;
                  const termName = term.name || '';
                  const termSlug = term.slug || '';
                  
                  if (termId && termName && !processedIndustries.has(termId)) {
                    processedIndustries.add(termId);
                    const existing = industryMap.get(termId) || { 
                      id: termId, 
                      name: termName, 
                      slug: termSlug, 
                      count: 0 
                    };
                    existing.count++;
                    industryMap.set(termId, existing);
                  }
                }
              });
            }
          });
        }
      }
    });
    
    return Array.from(industryMap.values())
      .filter(ind => ind.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [caseStudies]);

  // Initialize selected industries from URL on mount
  useEffect(() => {
    if (isInitialMount.current && availableIndustries.length > 0) {
      const industryParam = searchParams.get('industry');
      if (industryParam) {
        const industrySlugs = industryParam.split(',').map(s => s.trim()).filter(Boolean);
        const industryIds = new Set<number>();
        
        industrySlugs.forEach(slug => {
          const industry = availableIndustries.find(ind => ind.slug === slug);
          if (industry) {
            industryIds.add(industry.id);
          }
        });
        
        if (industryIds.size > 0) {
          setSelectedIndustries(industryIds);
        }
      }
      isInitialMount.current = false;
    }
  }, [searchParams, availableIndustries]);

  // Update URL when selected industries change (skip initial mount)
  useEffect(() => {
    if (!isInitialMount.current) {
      const params = new URLSearchParams(searchParams.toString());
      
      if (selectedIndustries.size > 0) {
        const industrySlugs = Array.from(selectedIndustries)
          .map(id => availableIndustries.find(ind => ind.id === id)?.slug)
          .filter(Boolean)
          .join(',');
        
        if (industrySlugs) {
          params.set('industry', industrySlugs);
        }
      } else {
        params.delete('industry');
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : '/case-study';
      router.push(newUrl, { scroll: false });
    }
  }, [selectedIndustries, availableIndustries, router, searchParams]);

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

  // Filter industries based on search query (same search for both)
  const filteredIndustries = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return availableIndustries;
    }
    
    const query = debouncedSearchQuery.toLowerCase();
    return availableIndustries.filter(ind => 
      ind.name.toLowerCase().includes(query)
    );
  }, [availableIndustries, debouncedSearchQuery]);

  // Filter case studies based on search query and selected categories/industries
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

    // Filter by selected industries
    if (selectedIndustries.size > 0) {
      filtered = filtered.filter(caseStudy => {
        // Check embedded terms
        if (caseStudy._embedded && caseStudy._embedded['wp:term']) {
          const terms = caseStudy._embedded['wp:term'];
          if (Array.isArray(terms)) {
            for (const taxonomyTerms of terms) {
              if (Array.isArray(taxonomyTerms)) {
                const hasIndustry = taxonomyTerms.some((term: any) => {
                  const isIndustry = term.taxonomy === 'industry';
                  const termId = term.id || term.term_id;
                  return isIndustry && selectedIndustries.has(termId);
                });
                if (hasIndustry) return true;
              }
            }
          }
        }
        return false;
      });
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
  }, [caseStudies, debouncedSearchQuery, selectedIndustries, selectedCategories]);

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

  // Handle industry toggle
  const handleIndustryToggle = useCallback((industryId: number) => {
    setSelectedIndustries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(industryId)) {
        newSet.delete(industryId);
      } else {
        newSet.add(industryId);
      }
      return newSet;
    });
    // Close mobile sidebar after selection on small screens
    if (window.innerWidth <= 768) {
      setTimeout(() => setIsSidebarOpen(false), 300);
    }
  }, []);

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
    // Close mobile sidebar after selection on small screens
    if (window.innerWidth <= 768) {
      setTimeout(() => setIsSidebarOpen(false), 300);
    }
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedIndustries(new Set());
    setSelectedCategories(new Set());
    setIsSidebarOpen(false); // Close sidebar on mobile after clearing
  }, []);

  return (
    <div className="case-studies-with-sidebar">
      {/* Mobile Filter Button - Only visible on mobile */}
      <button 
        className="mobile-filter-button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Open filters"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Filters</span>
        {(selectedIndustries.size > 0 || selectedCategories.size > 0) && (
          <span className="filter-badge">{selectedIndustries.size + selectedCategories.size}</span>
        )}
      </button>

      <div className="filter-wrapper">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="mobile-sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className={`case-studies-layout-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Left Sidebar - Desktop: always visible, Mobile: slide-in drawer */}
        <aside className={`filter-sidebar ${isSidebarOpen ? 'mobile-open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          {/* Sidebar Collapse Toggle Button */}
          <button 
            className="sidebar-collapse-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
            >
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="sidebar-container">
            {/* Mobile Close Button */}
            {/* <button 
              className="mobile-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close filters"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button> */}

            {/* Search Section */}
            <div className="search-section">
              <div className="search-input-wrapper">
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

            {/* Industries Section */}
            <div className="industries-section">
              <div className="industries-header">
                <h3 className="industries-title">Industries</h3>
                <div className="header-actions">
                  {selectedIndustries.size > 0 && (
                    <button onClick={() => setSelectedIndustries(new Set())} className="clear-filters-btn">
                      Clear
                    </button>
                  )}
                  <button 
                    onClick={() => setIsIndustriesCollapsed(!isIndustriesCollapsed)} 
                    className="collapse-btn"
                    aria-label={isIndustriesCollapsed ? "Expand industries" : "Collapse industries"}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      style={{ transform: isIndustriesCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className={`industries-list ${isIndustriesCollapsed ? 'collapsed' : ''}`}>
                {availableIndustries.length > 0 ? (
                  availableIndustries.map((industry) => (
                    <label
                      key={industry.id}
                      className={`industry-checkbox-label ${selectedIndustries.has(industry.id) ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIndustries.has(industry.id)}
                        onChange={() => handleIndustryToggle(industry.id)}
                        className="industry-checkbox"
                      />
                      <span className="checkbox-custom"></span>
                      <span className="industry-name">{industry.name}</span>
                      <span className="industry-count">({industry.count})</span>
                    </label>
                  ))
                ) : (
                  <div className="no-industries">
                    <p>No industries found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div className="categories-section">
              <div className="categories-header">
                <h3 className="categories-title">Services</h3>
                <div className="header-actions">
                  {selectedCategories.size > 0 && (
                    <button onClick={() => setSelectedCategories(new Set())} className="clear-filters-btn">
                      Clear
                    </button>
                  )}
                  <button 
                    onClick={() => setIsCategoriesCollapsed(!isCategoriesCollapsed)} 
                    className="collapse-btn"
                    aria-label={isCategoriesCollapsed ? "Expand categories" : "Collapse categories"}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      style={{ transform: isCategoriesCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className={`categories-list ${isCategoriesCollapsed ? 'collapsed' : ''}`}>
                {availableCategories.length > 0 ? (
                  availableCategories.map((category) => (
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
              {(debouncedSearchQuery || selectedIndustries.size > 0 || selectedCategories.size > 0) && (
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
              {(searchQuery || selectedIndustries.size > 0 || selectedCategories.size > 0) && (
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

        /* Mobile Filter Button - Hidden on Desktop */
        .mobile-filter-button {
          display: none;
        }

        /* Mobile Filter Bar - Hidden (using drawer instead) */
        .mobile-filter-bar {
          display: none;
        }

        /* Mobile Sidebar Overlay - Hidden on Desktop */
        .mobile-sidebar-overlay {
          display: none;
        }

        /* Mobile Close Button - Hidden on Desktop */
        .mobile-close-btn {
          display: none;
        }

        .case-studies-layout-container {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }

        /* Left Sidebar - Only visible on desktop */
        .filter-sidebar {
          flex-shrink: 0;
          width: 300px;
          position: sticky;
          top: 20px;
          align-self: flex-start;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-sidebar.collapsed {
          width: 50px;
        }

        .filter-sidebar.collapsed .sidebar-container {
          opacity: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .sidebar-collapse-toggle {
          position: absolute;
          top: 20px;
          right: -15px;
          width: 30px;
          height: 30px;
          background: #ffffff;
          border: 2px solid #FFFFFF66;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          color: #6b7280;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar-collapse-toggle:hover {
          background: #f9fafb;
          border-color: #0891b2;
          color: #0891b2;
          transform: scale(1.1);
        }

        .sidebar-container {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 150px);
          max-height: calc(100vh - 150px);
          transition: opacity 0.3s ease;
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

        .sidebar-container .search-icon {
          position: absolute;
          left: 12px;
          color: #6b7280;
          pointer-events: none;
          z-index: 1;
        }

        .sidebar-container .search-input {
          width: 100%;
          padding: 12px 40px 12px 40px;
         border: 2px solid #FFFFFF66;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: #f9fafb;
          box-sizing: border-box;
        }

        .sidebar-container .search-input:focus {
          outline: none;
          border-color: #0891b2;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
        }

        .sidebar-container .clear-search-btn {
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

        .sidebar-container .clear-search-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        /* Categories Section */
        .categories-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }

        /* Industries Section */
        .industries-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          max-height: 300px;
          overflow: hidden;
        }

        .industries-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-shrink: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .collapse-btn {
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
        }

        .collapse-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .industries-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .industries-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 0;
          max-height: 300px;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .industries-list.collapsed {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          margin-bottom: 0;
        }

        .industries-list::-webkit-scrollbar {
          width: 6px;
        }

        .industries-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .industries-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .industries-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .industry-checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .industry-checkbox-label:hover {
          background: #f9fafb;
        }

        .industry-checkbox-label.checked {
          background: #ecfeff;
        }

        .industry-checkbox {
          display: none;
        }

        .industry-checkbox:checked + .checkbox-custom {
          background: #0891b2;
          border-color: #0891b2;
        }

        .industry-checkbox:checked + .checkbox-custom::after {
          content: '✓';
          color: white;
          font-size: 14px;
          font-weight: bold;
        }

        .industry-name {
          flex: 1;
          font-size: 0.95rem;
          color: #374151;
          font-weight: 500;
        }

        .industry-checkbox-label.checked .industry-name {
          color: #0891b2;
          font-weight: 600;
        }

        .industry-count {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        .no-industries {
          padding: 20px;
          text-align: center;
          color: #6b7280;
        }

        .categories-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-shrink: 0;
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
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .categories-list.collapsed {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          margin-bottom: 0;
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
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          transition: all 0.3s ease;
        }

        /* When sidebar is collapsed, show 3 cards per row */
        .case-studies-layout-container.sidebar-collapsed .case-studies-grid {
          grid-template-columns: repeat(3, 1fr);
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
            max-height: calc(100vh - 120px);
            padding: 20px;
          }

          .case-studies-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }

        @media (max-width: 768px) {
          /* Fix overflow on mobile screens only */
          .case-studies-with-sidebar {
            overflow-x: hidden;
            max-width: 100%;
            position: relative;
          }

          .filter-wrapper {
            width: 100% !important;
            max-width: 100%;
            overflow-x: hidden;
          }

          /* Show Mobile Filter Button on Mobile */
          .mobile-filter-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
            margin-bottom: 20px;
            transition: all 0.3s ease;
            position: relative;
          }

          .mobile-filter-button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(8, 145, 178, 0.3);
          }

          .filter-badge {
            background: rgba(255, 255, 255, 0.3);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 700;
            margin-left: 4px;
          }

          /* Mobile Sidebar Overlay */
          .mobile-sidebar-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          /* Keep Mobile Filter Bar Hidden */
          .mobile-filter-bar {
            display: none !important;
          }


          /* Mobile Sidebar - Slide in from left */
          .filter-sidebar {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 85%;
            max-width: 320px;
            height: calc(100vh - 100px);
            z-index: 999;
            transition: left 0.3s ease-in-out;
            overflow: visible;
          }

          .filter-sidebar.mobile-open {
            left: 0;
          }

          /* Hide sidebar collapse toggle on mobile */
          .sidebar-collapse-toggle {
            display: none;
          }

          .sidebar-container {
            height: 100%;
            max-height: calc(100vh - 100px);
            border-radius: 0 12px 12px 0;
            padding: 20px;
            position: relative;
            overflow-y: auto;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
          }

          .sidebar-container::-webkit-scrollbar {
            width: 6px;
          }

          .sidebar-container::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }

          .sidebar-container::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }

          .sidebar-container::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          /* Mobile Close Button */
          .mobile-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 16px;
            right: 16px;
            width: 36px;
            height: 36px;
            background: #f3f4f6;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            color: #374151;
            transition: all 0.2s ease;
            z-index: 10;
          }

          .mobile-close-btn:active {
            background: #e5e7eb;
            transform: scale(0.95);
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
          .mobile-filter-button {
            font-size: 0.9rem;
            padding: 10px 18px;
          }

          .filter-sidebar {
            width: 90%;
          }

          .sidebar-container {
            padding: 16px;
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

