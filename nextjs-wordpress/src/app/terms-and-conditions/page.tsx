import React from 'react';
import { Metadata } from 'next';
import styles from '@/styles/components/legal-page.module.scss';

export const metadata: Metadata = {
  title: 'Terms & Conditions | MoreYeahs',
  description: 'Terms and Conditions for MoreYeahs - Learn about our terms of service and user agreements.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Terms & Conditions</h1>
          <p className={styles.effectiveDate}>
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className={styles.content}>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.paragraph}>
              By accessing and using the MoreYeahs website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Services Description</h2>
            <p className={styles.paragraph}>
              MoreYeahs provides technology consulting, software development, cloud infrastructure, data science, and digital transformation services. We specialize in:
            </p>
            <ul className={styles.list}>
              <li>Web and mobile application development</li>
              <li>Cloud infrastructure and DevOps solutions</li>
              <li>Data science and artificial intelligence</li>
              <li>Microsoft and Salesforce services</li>
              <li>Digital transformation consulting</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. User Responsibilities</h2>
            <p className={styles.paragraph}>As a user of our services, you agree to:</p>
            <ul className={styles.list}>
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use our services in compliance with applicable laws and regulations</li>
              <li>Not engage in any activity that could harm our systems or other users</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Intellectual Property Rights</h2>
            <p className={styles.paragraph}>
              All content, features, and functionality on our website, including but not limited to text, graphics, logos, images, and software, are the exclusive property of MoreYeahs and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Service Availability</h2>
            <p className={styles.paragraph}>
              We strive to maintain high availability of our services, but we do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of our services at any time with or without notice.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Payment Terms</h2>
            <p className={styles.paragraph}>
              Payment terms for our services will be specified in individual service agreements or contracts. Unless otherwise specified:
            </p>
            <ul className={styles.list}>
              <li>Payments are due within 30 days of invoice date</li>
              <li>Late payments may incur additional charges</li>
              <li>All fees are non-refundable unless otherwise stated</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Confidentiality</h2>
            <p className={styles.paragraph}>
              We understand the importance of confidentiality in business relationships. Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the course of our business relationship.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Limitation of Liability</h2>
            <p className={styles.paragraph}>
              To the fullest extent permitted by law, MoreYeahs shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business interruption.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Indemnification</h2>
            <p className={styles.paragraph}>
              You agree to indemnify and hold harmless MoreYeahs from any claims, damages, losses, or expenses arising from your use of our services or violation of these terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Governing Law</h2>
            <p className={styles.paragraph}>
              These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Indore, Madhya Pradesh.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Termination</h2>
            <p className={styles.paragraph}>
              We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these terms and conditions.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Changes to Terms</h2>
            <p className={styles.paragraph}>
              We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>13. Contact Information</h2>
            <p className={styles.paragraph}>If you have any questions about these Terms & Conditions, please contact us:</p>
            <div className={styles.contactBox}>
              <p><strong>Email:</strong> info@moreyeahs.com</p>
              <p><strong>Phone:</strong> +91 7415567401, +91 9324881631</p>
              <p><strong>Address:</strong> Indore, Madhya Pradesh, 452010, India</p>
            </div>
            </section>
        </div>
      </div>
    </div>
  );
}