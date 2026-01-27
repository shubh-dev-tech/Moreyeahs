'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
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

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  slug,
  excerpt,
  featured_image,
  date,
  author,
  categories
}) => {
  // Ensure title and excerpt are strings
  const displayTitle = typeof title === 'string' && title ? title : 'Untitled Post';
  const displayExcerpt = typeof excerpt === 'string' ? excerpt : '';
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <Link
      href={`/blog/${slug}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <article className="blog-card">
        {featured_image && (
          <div className="blog-card__image">
            <Image
              src={featured_image}
              alt={displayTitle}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        
        <div className="blog-card__content">
          {categories.length > 0 && (
            <div className="blog-card__categories">
              {categories.slice(0, 2).map((category, index) => (
                <span key={index} className="blog-card__category">
                  {category}
                </span>
              ))}
            </div>
          )}
          
          <h2 className="blog-card__title">
            {displayTitle}
          </h2>
          
          {displayExcerpt && (
            <div
              className="blog-card__excerpt"
              dangerouslySetInnerHTML={{ 
                __html: displayExcerpt.replace(/<[^>]+>/g, '').substring(0, 150) + '...' 
              }}
            />
          )}
          
          <div className="blog-card__meta">
            <div className="blog-card__author">
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={32}
                  height={32}
                  className="blog-card__author-avatar"
                />
              )}
              <span className="blog-card__author-name">{author.name}</span>
            </div>
            <span className="blog-card__date">{formatDate(date)}</span>
          </div>
          
          <div className="blog-card__link">
            Read More
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <style jsx>{`
          .blog-card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: white;
          }
          
          .blog-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.12);
            border-color: #667eea;
          }
          
          .blog-card__image {
            position: relative;
            width: 100%;
            height: 240px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .blog-card__content {
            padding: 24px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .blog-card__categories {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }
          
          .blog-card__category {
            display: inline-block;
            padding: 4px 12px;
            background-color: #f3f4f6;
            color: #6b7280;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            text-transform: capitalize;
          }
          
          .blog-card__title {
            font-size: 20px;
            margin-bottom: 12px;
            font-weight: 700;
            line-height: 1.4;
            color: #111827;
          }
          
          .blog-card__excerpt {
            font-size: 14px;
            line-height: 1.6;
            color: #6b7280;
            margin-bottom: 16px;
            flex: 1;
          }
          
          .blog-card__meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 16px;
            border-top: 1px solid #f3f4f6;
            margin-bottom: 16px;
          }
          
          .blog-card__author {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .blog-card__author-avatar {
            border-radius: 50%;
          }
          
          .blog-card__author-name {
            font-size: 13px;
            font-weight: 600;
            color: #374151;
          }
          
          .blog-card__date {
            font-size: 13px;
            color: #9ca3af;
          }
          
          .blog-card__link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #667eea;
            font-weight: 600;
            font-size: 14px;
            margin-top: auto;
          }
          
          .blog-card:hover .blog-card__link {
            gap: 12px;
          }
          
          .blog-card__link svg {
            transition: transform 0.2s;
          }
          
          .blog-card:hover .blog-card__link svg {
            transform: translateX(4px);
          }
          
          @media (max-width: 768px) {
            .blog-card__image {
              height: 200px;
            }
            
            .blog-card__title {
              font-size: 18px;
            }
          }
        `}</style>
      </article>
    </Link>
  );
};

export default BlogCard;
