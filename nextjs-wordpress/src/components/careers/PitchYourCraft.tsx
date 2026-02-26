'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './PitchYourCraft.module.css';

const PitchYourCraft: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    description: '',
    resume: null as File | null,
  });

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
    console.log('Pitch Your Craft form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <section className={styles.pitchSection}>
      <div className={styles.container}>
        <div className={styles.contentGrid}>
          {/* Left Side - Content */}
          <div className={styles.leftContent}>
            <div className={styles.logo}>
              <Image 
                src="https://dev.moreyeahs.com/wp-content/uploads/2026/02/Moreyeahs-Logo-7.png"
                alt="moreYeahs"
                width={180}
                height={40}
                priority
              />
            </div>
            
            <div className={styles.textContent}>
              <p className={styles.subtitle}>Direct Initiative</p>
              <h2 className={styles.title}>Pitch Your Craft.</h2>
              <p className={styles.description}>
                Can&apos;t find your ideal role? Believe it. We are always seeking extraordinary individuals.
              </p>
            </div>

            <div className={styles.benefits}>
              <div className={styles.benefitItem}>01 Global Exposure</div>
              <div className={styles.benefitItem}>02 Flexible Environment</div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className={styles.rightContent}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
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
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Your message"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
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
                  <label htmlFor="resume" className={styles.fileUploadLabel}>
                    <span className={styles.uploadIcon}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 15V5M10 5L6 9M10 5L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className={styles.uploadText}>Upload Attachment</span>
                  </label>
                  {formData.resume && (
                    <span className={styles.fileName}>{formData.resume.name}</span>
                  )}
                </div>
              </div>

              <button type="submit" className={styles.submitButton}>
                Submit <span className={styles.arrow}>▶</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PitchYourCraft;
