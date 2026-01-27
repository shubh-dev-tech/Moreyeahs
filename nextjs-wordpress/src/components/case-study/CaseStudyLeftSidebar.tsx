'use client';

import React from 'react';
import Image from 'next/image';

interface SidebarItem {
  item_label?: string;
  item_value?: string;
}

interface SidebarSection {
  section_icon?: {
    url: string;
    alt: string;
  };
  section_title: string;
  section_items?: SidebarItem[];
}

interface DownloadButton {
  button_icon?: {
    url: string;
    alt: string;
  };
  button_text: string;
  button_url: string;
  open_in_new_tab?: boolean;
}

interface CaseStudyLeftSidebarProps {
  sidebarSections?: SidebarSection[];
  backgroundColor?: string;
  textColor?: string;
  showDownloadButtons?: boolean;
  downloadButtons?: DownloadButton[];
  className?: string;
}

const CaseStudyLeftSidebar: React.FC<CaseStudyLeftSidebarProps> = ({
  sidebarSections = [],
  backgroundColor = '#e91e63',
  textColor = '#ffffff',
  showDownloadButtons = true,
  downloadButtons = [],
  className = ''
}) => {
  const sidebarStyles = {
    backgroundColor,
    color: textColor
  };

  return (
    <div className={`case-study-left-sidebar ${className}`} style={sidebarStyles}>
      <div className="case-study-sidebar__content">
        {sidebarSections.map((section, index) => (
          <div key={index} className="sidebar-section">
            {section.section_icon && (
              <div className="sidebar-section__icon">
                <Image
                  src={section.section_icon.url}
                  alt={section.section_title}
                  width={24}
                  height={24}
                />
              </div>
            )}
            
            <h3 className="sidebar-section__title">{section.section_title}</h3>
            
            {section.section_items && section.section_items.length > 0 && (
              <div className="sidebar-section__items">
                {section.section_items.map((item, itemIndex) => (
                  <div key={itemIndex} className="sidebar-item">
                    {item.item_label && (
                      <div className="sidebar-item__label">{item.item_label}</div>
                    )}
                    {item.item_value && (
                      <div className="sidebar-item__value">{item.item_value}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {showDownloadButtons && downloadButtons.length > 0 && (
          <div className="sidebar-downloads">
            {downloadButtons.map((button, index) => (
              <a
                key={index}
                href={button.button_url}
                className="sidebar-download-btn"
                target={button.open_in_new_tab ? '_blank' : '_self'}
                rel={button.open_in_new_tab ? 'noopener noreferrer' : undefined}
              >
                {button.button_icon && (
                  <Image
                    src={button.button_icon.url}
                    alt=""
                    width={16}
                    height={16}
                  />
                )}
                {button.button_text}
              </a>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .case-study-left-sidebar {
          border-radius: 16px;
          padding: 40px 30px;
          box-shadow: 0 8px 30px rgba(233, 30, 99, 0.25);
        }

        .case-study-sidebar__content {
          display: flex;
          flex-direction: column;
          gap: 35px;
        }

        .sidebar-section {
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 30px;
        }

        .sidebar-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .sidebar-section__icon {
          margin-bottom: 15px;
        }

        .sidebar-section__icon :global(img) {
          filter: brightness(0) invert(1);
        }

        .sidebar-section__title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 25px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.3;
        }

        .sidebar-section__items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-item__label {
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .sidebar-item__value {
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.4;
        }

        .sidebar-downloads {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .sidebar-download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: inherit;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .sidebar-download-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          color: inherit;
          text-decoration: none;
        }

        .sidebar-download-btn :global(img) {
          filter: brightness(0) invert(1);
        }

        @media (max-width: 768px) {
          .case-study-left-sidebar {
            padding: 25px 20px;
          }
          
          .case-study-sidebar__content {
            gap: 25px;
          }
          
          .sidebar-section {
            padding-bottom: 20px;
          }
          
          .sidebar-section__title {
            font-size: 1rem;
            margin-bottom: 15px;
          }
        }

        @media (max-width: 480px) {
          .case-study-left-sidebar {
            padding: 20px 15px;
          }
          
          .case-study-sidebar__content {
            gap: 20px;
          }
          
          .sidebar-downloads {
            gap: 10px;
          }
          
          .sidebar-download-btn {
            padding: 10px 14px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudyLeftSidebar;