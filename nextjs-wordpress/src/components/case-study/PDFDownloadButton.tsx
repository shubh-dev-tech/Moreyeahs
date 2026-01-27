'use client';

import React, { useState } from 'react';
import { downloadCaseStudyPDF } from '../../utils/pdfGenerator';
import styles from './PDFDownloadButton.module.css';

interface PDFDownloadButtonProps {
  caseStudyTitle?: string;
  className?: string;
  variant?: 'sidebar' | 'inline';
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  caseStudyTitle = 'Case Study',
  className = '',
  variant = 'sidebar'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting PDF generation for:', caseStudyTitle);
      await downloadCaseStudyPDF(caseStudyTitle);
      console.log('PDF generation completed successfully');
    } catch (error) {
      console.error('PDF download failed:', error);
      
      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to generate PDF: ${errorMessage}\n\nPlease try refreshing the page and trying again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const buttonClass = variant === 'sidebar' 
    ? `${styles.sidebarDownloadBtn} ${className}` 
    : `${styles.inlineDownloadBtn} ${className}`;

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={buttonClass}
      type="button"
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.downloadIcon}
      >
        <path 
          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <polyline 
          points="14,2 14,8 20,8" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <line 
          x1="16" 
          y1="13" 
          x2="8" 
          y2="13" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <line 
          x1="16" 
          y1="17" 
          x2="8" 
          y2="17" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <polyline 
          points="10,9 9,9 8,9" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
    </button>
  );
};

export default PDFDownloadButton;