'use client';

import React, { useEffect, useState, useRef } from 'react';
import BlogCard from '@/components/blog/BlogCard';

const INITIAL_CARDS = 3;
const CARDS_PER_LOAD = 3;
const INITIAL_LOADING_TIME = 2000; // milliseconds (2 sec)
const SCROLL_LOADING_DELAY = 600; // milliseconds

interface BlogPostCardData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  date: string;
  author: {
    name: string;
    avatar: string | null;
  };
  categories: string[];
}

interface BlogPostsWithLoadingProps {
  posts: BlogPostCardData[];
  gridClassName: string;
}

export default function BlogPostsWithLoading({
  posts,
  gridClassName,
}: BlogPostsWithLoadingProps) {
  const [visibleCardsCount, setVisibleCardsCount] = useState(INITIAL_CARDS);
  const [isInitialLoading, setIsInitialLoading] = useState(
    posts.length > INITIAL_CARDS
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Initial loading effect (after first 3 cards)
  useEffect(() => {
    if (posts.length <= INITIAL_CARDS) {
      setIsInitialLoading(false);
      setVisibleCardsCount(posts.length);
      return;
    }

    if (isInitialLoading && posts.length > INITIAL_CARDS) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, INITIAL_LOADING_TIME);

      return () => clearTimeout(timer);
    } else if (posts.length <= INITIAL_CARDS) {
      setIsInitialLoading(false);
    }
  }, [isInitialLoading, posts.length]);

  // Lazy loading with Intersection Observer (only after initial loading is done)
  useEffect(() => {
    if (isInitialLoading || visibleCardsCount >= posts.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore) {
          const currentPostsCount = posts.length;
          if (visibleCardsCount < currentPostsCount) {
            setIsLoadingMore(true);
            // Add delay before loading more cards
            setTimeout(() => {
              setVisibleCardsCount((prev) => {
                const nextCount = prev + CARDS_PER_LOAD;
                setIsLoadingMore(false);
                return Math.min(nextCount, currentPostsCount);
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
  }, [visibleCardsCount, posts.length, isLoadingMore, isInitialLoading]);

  return (
    <>
      <div className={gridClassName}>
        {posts.slice(0, visibleCardsCount).map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            featured_image={post.featured_image}
            date={post.date}
            author={post.author}
            categories={post.categories}
          />
        ))}
      </div>

      {/* Initial Loading Indicator (after 3 cards for 2 seconds) */}
      {isInitialLoading && posts.length > INITIAL_CARDS && (
        <div className="loading-indicator" aria-live="polite" aria-busy="true">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading blogs...</p>
        </div>
      )}

      {/* Lazy Loading Trigger and Indicator */}
      {!isInitialLoading && visibleCardsCount < posts.length && (
        <div ref={loadMoreRef} className="load-more-trigger">
          {isLoadingMore && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading more blogs...</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        /* Loading Indicator (same pattern as Case Studies) */
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

        @media (max-width: 768px) {
          .loading-indicator {
            padding: 30px 15px;
            gap: 12px;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
          }

          .loading-text {
            font-size: 0.85rem;
          }

          .load-more-trigger {
            margin-top: 30px;
            min-height: 80px;
          }
        }
      `}</style>
    </>
  );
}


