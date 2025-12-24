'use client';

import React from 'react';

interface CaseStudyLayoutProps {
  enableSidebar?: boolean;
  sidebarWidth?: string;
  contentGap?: string;
  containerMaxWidth?: string;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({
  enableSidebar = true,
  sidebarWidth = '300px',
  contentGap = '40px',
  containerMaxWidth = '1200px',
  sidebar,
  children,
  className = ''
}) => {
  const layoutStyles = {
    maxWidth: containerMaxWidth,
    gap: contentGap
  };

  const sidebarStyles = {
    width: sidebarWidth,
    minWidth: sidebarWidth
  };

  return (
    <div className={`case-study-layout ${className}`}>
      <div className="case-study-layout__container" style={layoutStyles}>
        {enableSidebar && sidebar && (
          <div className="case-study-layout__sidebar" style={sidebarStyles}>
            {sidebar}
          </div>
        )}
        
        <div className="case-study-layout__content">
          {children}
        </div>
      </div>

      <style jsx>{`
        .case-study-layout {
          padding: 50px 20px;
          background: transparent;
        }

        .case-study-layout__container {
          margin: 0 auto;
          display: flex;
          gap: 60px;
          align-items: flex-start;
        }

        .case-study-layout__sidebar {
          flex-shrink: 0;
          position: sticky;
          top: 20px;
        }

        .case-study-layout__content {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 1024px) {
          .case-study-layout__container {
            gap: 30px;
          }
          
          .case-study-layout__sidebar {
            width: 250px !important;
            min-width: 250px !important;
          }
        }

        @media (max-width: 768px) {
          .case-study-layout {
            padding: 40px 15px;
          }
          
          .case-study-layout__container {
            flex-direction: column;
            gap: 40px;
          }
          
          .case-study-layout__sidebar {
            width: 100% !important;
            min-width: 100% !important;
            position: static;
            order: 2;
          }
          
          .case-study-layout__content {
            order: 1;
          }
        }

        @media (max-width: 480px) {
          .case-study-layout {
            padding: 30px 10px;
          }
          
          .case-study-layout__container {
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudyLayout;