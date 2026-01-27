"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { WORDPRESS_API_URL } from '@/lib/env';
import type {
  ContactFormData,
  ContactFormState,
  ContactFormSuccessResponse,
  ContactFormErrorResponse,
} from '@/types/contact-form';

/**
 * ContactForm Component
 * 
 * A dynamic headless WordPress contact form with email, phone, and message fields.
 * Preserves the existing HTML structure and CSS classes while adding React state management
 * and WordPress REST API integration.
 * 
 * Features:
 * - Controlled form inputs with React state
 * - Client-side validation
 * - Server-side validation via WordPress REST API
 * - Loading state management
 * - Success and error message display
 * - Disabled button while submitting
 * 
 * @returns {JSX.Element} Contact form component
 */
export default function ContactForm() {
  // Form data state
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    phone: '',
    message: '',
  });

  // Form submission state
  const [formState, setFormState] = useState<ContactFormState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    responseMessage: '',
  });

  /**
   * Handle input change events
   * Updates form data state as user types
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   * Sends form data to WordPress REST API endpoint
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset previous states
    setFormState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      responseMessage: '',
    });

    try {
      // Send POST request to WordPress REST API
      const response = await fetch(`${WORDPRESS_API_URL}/custom/v1/contact-submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success response
        const successData = data as ContactFormSuccessResponse;
        setFormState({
          isSubmitting: false,
          isSuccess: true,
          isError: false,
          responseMessage: successData.message,
        });

        // Reset form data
        setFormData({
          email: '',
          phone: '',
          message: '',
        });
      } else {
        // Error response
        const errorData = data as ContactFormErrorResponse;
        const errorMessage = errorData.data?.errors
          ? errorData.data.errors.join(' ')
          : errorData.message || 'Something went wrong. Please try again.';

        setFormState({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          responseMessage: errorMessage,
        });
      }
    } catch (error) {
      // Network or other errors
      console.error('Contact form submission error:', error);
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        responseMessage: 'Network error. Please check your connection and try again.',
      });
    }
  };

  return (
    <div className="contact-form-wrapper">
      <h2 className="contact-title">Contact Us</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
              disabled={formState.isSubmitting}
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="form-input"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={formState.isSubmitting}
            />
          </div>
        </div>

        <div className="form-group">
          <textarea
            name="message"
            placeholder="Write your message..."
            required
            rows={2}
            className="form-textarea"
            value={formData.message}
            onChange={handleInputChange}
            disabled={formState.isSubmitting}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Sending...' : 'Send Message'}
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>

        {/* Success Message */}
        {formState.isSuccess && (
          <div className="form-message form-message-success" style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
          }}>
            {formState.responseMessage}
          </div>
        )}

        {/* Error Message */}
        {formState.isError && (
          <div className="form-message form-message-error" style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
          }}>
            {formState.responseMessage}
          </div>
        )}
      </form>
    </div>
  );
}
