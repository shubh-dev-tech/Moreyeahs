'use client';

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { downloadCaseStudyPDF } from '../../utils/pdfGenerator';
import styles from './PDFDownloadButton.module.css';

interface PDFDownloadButtonProps {
  caseStudyTitle?: string;
  className?: string;
  variant?: 'sidebar' | 'inline';
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  caseStudyTitle = 'Case Study',
  className = '',
  variant = 'sidebar'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Don't allow closing modal while generating PDF
    if (isGenerating) return;
    setShowModal(false);
    // Reset form when closing
    setFormData({ name: '', email: '', phone: '' });
    setFormErrors({});
    setSubmitError('');
    setSubmitSuccess(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
    setSubmitError('');
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Check if at least one contact method is provided
    const hasEmail = formData.email.trim().length > 0;
    const hasPhone = formData.phone.trim().length > 0;
    
    if (!hasEmail && !hasPhone) {
      errors.email = 'Please provide either email or phone number';
      errors.phone = 'Please provide either email or phone number';
    } else {
      // Validate email format only if email is provided
      if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      // Phone validation can be added here if needed
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAndDownload = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isGenerating) return;
    
    setIsGenerating(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // First, submit the form data via API
      const response = await fetch('/api/case-study-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          caseStudyTitle
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit form');
      }

      // Show success message
      setSubmitSuccess(true);
      
      // If form submission is successful, proceed with PDF download
      console.log('Form submitted successfully, starting PDF generation for:', caseStudyTitle);
      await downloadCaseStudyPDF(caseStudyTitle);
      console.log('PDF generation completed successfully');
      
      // Wait a moment to show success message, then close modal
      setTimeout(() => {
        setShowModal(false);
        // Reset form
        setFormData({ name: '', email: '', phone: '' });
        setFormErrors({});
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Submit and download failed:', error);
      
      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(`Failed to process request: ${errorMessage}`);
      setSubmitSuccess(false);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const buttonClass = variant === 'sidebar' 
    ? `${styles.sidebarDownloadBtn} ${className}` 
    : `${styles.inlineDownloadBtn} ${className}`;

  // Modal content to be rendered in portal
  const modalContent = showModal && mounted ? (
    <>
      <div className={styles.modalOverlay} onClick={handleCloseModal}></div>
      <div 
        ref={modalRef}
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className={styles.modalCloseBtn} 
          onClick={handleCloseModal}
          disabled={isGenerating}
          aria-label="Close modal"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className={styles.modalBody}>
          <h3 className={styles.modalTitle}>Download Case Study</h3>
          <p className={styles.modalText}>
            Please fill in your name and at least one contact method (email or phone) to download this case study as PDF.
          </p>
          
          <form onSubmit={handleSubmitAndDownload} className={styles.downloadForm}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isGenerating}
                className={formErrors.name ? styles.formInputError : styles.formInput}
                required
              />
              {formErrors.name && (
                <span className={styles.errorText}>{formErrors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isGenerating}
                className={formErrors.email ? styles.formInputError : styles.formInput}
              />
              {formErrors.email && (
                <span className={styles.errorText}>{formErrors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isGenerating}
                className={formErrors.phone ? styles.formInputError : styles.formInput}
              />
              {formErrors.phone && (
                <span className={styles.errorText}>{formErrors.phone}</span>
              )}
            </div>

            {submitSuccess && (
              <div className={styles.submitSuccess}>
                ✓ Form submitted successfully! Downloading PDF...
              </div>
            )}

            {submitError && (
              <div className={styles.submitError}>
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className={styles.modalDownloadBtn}
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
              {isGenerating ? 'Submitting & Generating PDF...' : 'Submit & Download'}
            </button>
          </form>
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
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

      {/* Render modal in portal at document body level */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};

export default PDFDownloadButton;