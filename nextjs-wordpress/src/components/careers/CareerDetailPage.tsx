'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner';
import styles from './CareerDetailPage.module.css';

interface CareerDetailData {
  id: number;
  title: {
    rendered: string;
  };
  acf_fields?: {
    job_type?: string;
    department?: string;
    location?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    job_sections?: Array<{
      section_heading: string;
      section_content?: Array<{
        paragraph?: string;
        bullet_points?: Array<{
          bullet_text: string;
        }>;
      }>;
    }>;
  };
}

interface CareerDetailPageProps {
  career: CareerDetailData;
  className?: string;
}

const CareerDetailPage: React.FC<CareerDetailPageProps> = ({
  career,
  className = ''
}) => {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    resume: null as File | null,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!career) {
    return <LoadingSpinner message="Loading career details..." />;
  }

  if (!isClient) {
    return <LoadingSpinner message="Initializing..." />;
  }

  const acf = career.acf_fields || {};
  const jobSections = acf.job_sections || [];
  const backgroundImage = acf.background_image?.url || 'https://dev.moreyeahs.com/wp-content/uploads/2026/02/Group-1000001836.webp';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className={`${styles.careerDetail} ${className}`}>
      {/* Header Section */}
      <section 
        className={styles.headerSection}
        style={{
          // backgroundImage: `linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={styles.headerContent}>
          <h1 className={styles.jobTitle}>{career.title.rendered}</h1>
          <div className={styles.jobMeta}>
            {acf.department && (
              <span className={styles.metaBadge}>{acf.department}</span>
            )}
            {acf.job_type && (
              <span className={styles.metaBadge}>{acf.job_type}</span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Left Content - Job Details */}
            <main className={styles.jobContent}>
              {/* Overview Section */}
              {jobSections.length > 0 && (
                <>
                  {jobSections.map((section, index) => (
                    <div key={index} className={styles.jobSection}>
                      <h2 className={styles.sectionHeading}>{section.section_heading}</h2>
                      
                      {section.section_content && Array.isArray(section.section_content) && (
                        <div className={styles.sectionContent}>
                          {section.section_content.map((content, contentIndex) => (
                            <div key={contentIndex} className={styles.contentBlock}>
                              {content.paragraph && (
                                <p className={styles.paragraph}>{content.paragraph}</p>
                              )}
                              
                              {content.bullet_points && Array.isArray(content.bullet_points) && content.bullet_points.length > 0 && (
                                <ul className={styles.bulletList}>
                                  {content.bullet_points.map((bullet, bulletIndex) => (
                                    <li key={bulletIndex}>{bullet.bullet_text}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </main>

            {/* Right Sidebar - Application Form */}
            <aside className={styles.applicationSidebar}>
              <div className={styles.applicationForm}>
                <h3 className={styles.formTitle}>
                  <span className={styles.formIcon}>✈️</span> Apply Now
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your name"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter your name"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                      type="text"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      placeholder="Your message"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="resume">Resume / Portfolio (PDF) *</label>
                    <div className={styles.fileUpload}>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                      <div className={styles.fileUploadLabel}>
                        <span className={styles.uploadIcon}>📎</span>
                        <span>Upload Attachment</span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Submit ▶
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerDetailPage;
