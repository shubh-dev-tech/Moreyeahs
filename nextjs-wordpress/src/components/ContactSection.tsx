'use client';

import React, { useState } from 'react';

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city_state?: string;
}

interface ContactSectionProps {
  contact_info?: ContactInfo;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contact_info }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.message) {
      setMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // First, try to send to WordPress plugin API
      let wpSuccess = false;
      let wpError = '';
      
      const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';
      const wpEndpoint = `${wpApiUrl}/wp-json/contact-form/v1/submit`;
      
      try {
        const wpResponse = await fetch(wpEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.email.split('@')[0], // Use email prefix as name fallback
            email: formData.email,
            phone: formData.phone,
            subject: 'Contact Form Submission',
            message: formData.message,
          }),
        });
        
        if (wpResponse.ok) {
          const wpResult = await wpResponse.json();
          wpSuccess = wpResult.success;
          if (!wpSuccess) {
            wpError = wpResult.message || 'WordPress API failed';
          }
        } else {
          wpError = `WordPress API returned ${wpResponse.status}`;
        }
      } catch (wpErr) {
        console.error('WordPress API error:', wpErr);
        wpError = `WordPress API error: ${wpErr instanceof Error ? wpErr.message : 'Unknown error'}`;
      }

      // Then send to existing email API
      let emailSuccess = false;
      let emailError = '';
      
      console.log('Attempting Email API call...');
      
      try {
        const emailResponse = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          emailSuccess = emailResult.success;
          if (!emailSuccess) {
            emailError = emailResult.error || 'Email API failed';
          }
        } else {
          emailError = `Email API returned ${emailResponse.status}`;
        }
      } catch (emailErr) {
        console.error('Email API error:', emailErr);
        emailError = `Email API error: ${emailErr instanceof Error ? emailErr.message : 'Unknown error'}`;
      }

      // Show appropriate message based on results
      
      if (emailSuccess && wpSuccess) {
        setMessage('Thank you! Your message has been sent successfully and saved to our records.');
        setFormData({ email: '', phone: '', message: '' });
      } else if (emailSuccess) {
        setMessage('Thank you! Your message has been sent successfully.');
        setFormData({ email: '', phone: '', message: '' });
      } else if (wpSuccess) {
        setMessage('Thank you! Your message has been saved. We will get back to you soon.');
        setFormData({ email: '', phone: '', message: '' });
      } else {
        // Show specific error messages for debugging
        let errorMsg = 'There was an issue processing your message. ';
        if (emailError) errorMsg += `Email: ${emailError}. `;
        if (wpError) errorMsg += `Database: ${wpError}. `;
        errorMsg += 'Please try again or contact us directly.';
        setMessage(errorMsg);
      }

    } catch (error) {
      console.error('Contact form error:', error);
      setMessage(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="footer-contact-section">
      <div className="container">
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <h2 className="contact-title">From Vision to Value—Guided by Experts</h2>
            
            {/* Expertise Section */}
            <div className="expertise-section">
              <div className="expertise-item">
                <div className="expertise-icon">
                  <img src="https://dev.moreyeahs.com/wp-content/uploads/2026/02/WorkspacePremiumOutlined-5.png" alt="Expertise Icon" width="32" height="32" />
                </div>
                <div className="expertise-content">
                  <h3 className="expertise-title">11+ Years of Expertise</h3>
                  <p className="expertise-description">Driving high-impact solutions through deep industry expertise and proven experience.</p>
                </div>
              </div>

              <div className="expertise-item">
                <div className="expertise-icon">
                  <img src="https://dev.moreyeahs.com/wp-content/uploads/2026/02/HandshakeOutlined.png" alt="Handshake Icon" width="32" height="32" />
                </div>
                <div className="expertise-content">
                  <h3 className="expertise-title">100+ Satisfied Clients</h3>
                  <p className="expertise-description">Empowering industry software experts to achieve their brand objectives.</p>
                </div>
              </div>

              <div className="expertise-item">
                <div className="expertise-icon">
                  <img src="https://dev.moreyeahs.com/wp-content/uploads/2026/02/GroupsOutlined-1.png" alt="Groups Icon" width="32" height="32" />
                </div>
                <div className="expertise-content">
                  <h3 className="expertise-title">150+ In House Team Members</h3>
                  <p className="expertise-description">Expert team built to successfully deliver projects of any size.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            {/* <h2 className="contact-title">Contact Us</h2> */}
            
            {message && (
              <div style={{
                padding: '10px 15px',
                marginBottom: '15px',
                borderRadius: '5px',
                backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                color: message.includes('successfully') ? '#155724' : '#721c24',
                border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {message}
              </div>
            )}
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="form-textarea"
                  disabled={isSubmitting}
                />
              </div>
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;