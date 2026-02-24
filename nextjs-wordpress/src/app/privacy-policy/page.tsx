import React from 'react';
import { Metadata } from 'next';
import styles from '@/styles/components/legal-page.module.scss';

export const metadata: Metadata = {
  title: 'Privacy Policy | MoreYeahs',
  description: 'Privacy Policy for MoreYeahs - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.effectiveDate}>
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className={styles.content}>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introduction</h2>
            <p className={styles.paragraph}>
              MoreYeahs (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
            <h3 className={styles.subsectionTitle}>Personal Information</h3>
            <p className={styles.paragraph}>We may collect personal information that you voluntarily provide to us, including:</p>
            <ul className={styles.list}>
              <li>Name and contact information (email address, phone number)</li>
              <li>Company information</li>
              <li>Project requirements and specifications</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className={styles.subsectionTitle}>Automatically Collected Information</h3>
            <p className={styles.paragraph}>We may automatically collect certain information about your device and usage, including:</p>
            <ul className={styles.list}>
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our website</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
            <p className={styles.paragraph}>We use the information we collect to:</p>
            <ul className={styles.list}>
              <li>Provide and maintain our services</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you technical notices and support messages</li>
              <li>Communicate with you about products, services, and promotional offers</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Information Sharing and Disclosure</h2>
            <p className={styles.paragraph}>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
            <ul className={styles.list}>
              <li>With your explicit consent</li>
              <li>To trusted service providers who assist us in operating our website and conducting our business</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Data Security</h2>
            <p className={styles.paragraph}>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your Rights</h2>
            <p className={styles.paragraph}>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className={styles.list}>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Cookies and Tracking Technologies</h2>
            <p className={styles.paragraph}>
              We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Third-Party Links</h2>
            <p className={styles.paragraph}>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Changes to This Privacy Policy</h2>
            <p className={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Contact Us</h2>
            <p className={styles.paragraph}>If you have any questions about this Privacy Policy, please contact us:</p>
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