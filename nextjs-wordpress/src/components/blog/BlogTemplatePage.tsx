'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';

interface BlogPostTemplateData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  featured_image?: string;
  author?: {
    name: string;
    avatar: string | null;
  };
  categories?: string[];
  tags?: string[];
  acf_fields?: any;
}

interface BlogTemplatePageProps {
  post: BlogPostTemplateData;
  className?: string;
}

const BlogTemplatePage: React.FC<BlogTemplatePageProps> = ({
  post,
  className = ''
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure we have valid data
  if (!post) {
    return <LoadingSpinner message="Loading blog post..." />;
  }

  if (!isClient) {
    return <LoadingSpinner message="Initializing..." />;
  }

  const title = typeof post.title === 'string' ? post.title : post.title?.rendered || 'Untitled Post';
  const content = typeof post.content === 'string' ? post.content : post.content?.rendered || '';
  const excerpt = typeof post.excerpt === 'string' ? post.excerpt : post.excerpt?.rendered || '';
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]+>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const readingTime = calculateReadingTime(content);

  return (
    <article className={`blog-post-template ${className}`}>
      {/* Hero Section */}
      <div className="blog-post-hero">
        <div className="blog-post-hero__container">
          {post.categories && post.categories.length > 0 && (
            <div className="blog-post-hero__categories">
              {post.categories.slice(0, 3).map((category, index) => (
                <span key={index} className="blog-post-hero__category">
                  {category}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="blog-post-hero__title">{title}</h1>
          
          {excerpt && (
            <div 
              className="blog-post-hero__excerpt"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeWordPressContent(excerpt) 
              }}
            />
          )}
          
          <div className="blog-post-hero__meta">
            {post.author && (
              <div className="blog-post-hero__author">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="blog-post-hero__author-avatar"
                  />
                )}
                <div className="blog-post-hero__author-info">
                  <span className="blog-post-hero__author-name">
                    {post.author.name}
                  </span>
                  <div className="blog-post-hero__meta-details">
                    <span>{formatDate(post.date)}</span>
                    <span>•</span>
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="blog-post-featured-image">
          <div className="blog-post-featured-image__container">
            <Image
              src={post.featured_image}
              alt={title}
              width={1200}
              height={600}
              className="blog-post-featured-image__img"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="blog-post-content">
        <div className="blog-post-content__container">
          <div 
            className="blog-post-content__body"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeWordPressContent(content) 
            }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="blog-post-tags">
              <h3 className="blog-post-tags__title">Tags:</h3>
              <div className="blog-post-tags__list">
                {post.tags.map((tag, index) => (
                  <span key={index} className="blog-post-tags__tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .blog-post-template {
          min-height: 100vh;
          background-color: #ffffff;
        }

        .blog-post-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0 60px;
        }

        .blog-post-hero__container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .blog-post-hero__categories {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .blog-post-hero__category {
          display: inline-block;
          padding: 6px 16px;
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .blog-post-hero__title {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .blog-post-hero__excerpt {
          font-size: 20px;
          line-height: 1.6;
          opacity: 0.95;
          margin-bottom: 32px;
        }

        .blog-post-hero__meta {
          margin-top: 32px;
        }

        .blog-post-hero__author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .blog-post-hero__author-avatar {
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .blog-post-hero__author-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .blog-post-hero__author-name {
          font-size: 16px;
          font-weight: 700;
        }

        .blog-post-hero__meta-details {
          display: flex;
          gap: 8px;
          font-size: 14px;
          opacity: 0.9;
        }

        .blog-post-featured-image {
          margin-top: -60px;
          position: relative;
          z-index: 1;
        }

        .blog-post-featured-image__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .blog-post-featured-image__img {
          width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .blog-post-content {
          padding: 80px 0;
        }

        .blog-post-content__container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .blog-post-content__body {
          font-size: 18px;
          line-height: 1.8;
          color: #1f2937;
        }

        .blog-post-content__body :global(h2) {
          font-size: 32px;
          font-weight: 700;
          margin-top: 48px;
          margin-bottom: 24px;
          color: #111827;
        }

        .blog-post-content__body :global(h3) {
          font-size: 24px;
          font-weight: 600;
          margin-top: 36px;
          margin-bottom: 16px;
          color: #111827;
        }

        .blog-post-content__body :global(p) {
          margin-bottom: 24px;
        }

        .blog-post-content__body :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 32px 0;
        }

        .blog-post-content__body :global(a) {
          color: #667eea;
          text-decoration: underline;
        }

        .blog-post-content__body :global(ul),
        .blog-post-content__body :global(ol) {
          margin-bottom: 24px;
          padding-left: 32px;
        }

        .blog-post-content__body :global(li) {
          margin-bottom: 12px;
        }

        .blog-post-content__body :global(blockquote) {
          border-left: 4px solid #667eea;
          padding-left: 24px;
          margin: 32px 0;
          font-style: italic;
          color: #4b5563;
        }

        .blog-post-content__body :global(pre) {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 24px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 32px 0;
        }

        .blog-post-content__body :global(code) {
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
        }

        .blog-post-content__body :global(pre code) {
          background-color: transparent;
          padding: 0;
        }

        .blog-post-tags {
          margin-top: 64px;
          padding-top: 32px;
          border-top: 2px solid #e5e7eb;
        }

        .blog-post-tags__title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #111827;
        }

        .blog-post-tags__list {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .blog-post-tags__tag {
          display: inline-block;
          padding: 8px 16px;
          background-color: #f3f4f6;
          color: #6b7280;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          text-transform: lowercase;
        }

        @media (max-width: 768px) {
          .blog-post-hero {
            padding: 60px 0 40px;
          }

          .blog-post-hero__title {
            font-size: 32px;
          }

          .blog-post-hero__excerpt {
            font-size: 16px;
          }

          .blog-post-featured-image {
            margin-top: -40px;
          }

          .blog-post-content {
            padding: 60px 0;
          }

          .blog-post-content__body {
            font-size: 16px;
          }

          .blog-post-content__body :global(h2) {
            font-size: 24px;
          }

          .blog-post-content__body :global(h3) {
            font-size: 20px;
          }
        }
      `}</style>
    </article>
  );
};

export default BlogTemplatePage;
