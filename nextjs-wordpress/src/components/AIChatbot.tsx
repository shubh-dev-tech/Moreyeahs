'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";

// Type definitions for chatbot data structures
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface PreChatFormData {
  name: string;
  email: string;
  contact_number?: string;
}



const AIChatbot: React.FC = () => {
  // UI State Management
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<PreChatFormData>({
    name: '',
    email: '',
    contact_number: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<PreChatFormData>>({});
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus chat input when chat opens
  useEffect(() => {
    if (isOpen && !showForm && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [isOpen, showForm]);

  // Restore existing session on component mount
  useEffect(() => {
    const existingSession = sessionStorage.getItem('session_id');
    const storedName = sessionStorage.getItem('user_name');
    const storedEmail = sessionStorage.getItem('user_email');
    
    if (existingSession && storedName && storedEmail) {
      setSessionId(existingSession);
      setShowForm(false);
      loadChatHistory(existingSession);
    }
  }, []);

  /**
   * Load chat history for an existing session
   * Fetches previous messages from the backend API
   */
  const loadChatHistory = async (session_id: string) => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch(`/api/chatbot/history/${session_id}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
          // Filter out only the user's "Hi" message, keep the bot's welcome message
          const filteredMessages = data.messages.filter((msg: any, index: number) => {
            // Remove only if it's a user message with "hi" content
            return !(msg.role === 'user' && msg.content.trim().toLowerCase() === 'hi');
          });

          // Transform API response to ChatMessage format
          const loadedMessages: ChatMessage[] = filteredMessages.map((msg: any, index: number) => ({
            id: msg.id || `${Date.now()}-${index}`,
            text: msg.content || msg.text || msg.message,
            sender: msg.role === 'user' ? 'user' : 'bot',
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          }));
          
          setMessages(loadedMessages);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  /**
   * Toggle chatbot open/close state
   * Restores session if exists, otherwise shows form
   */
  const toggleChatbot = async () => {
    if (!isOpen) {
      const existingSession = sessionStorage.getItem('session_id');
      
      if (existingSession) {
        setShowForm(false);
        setIsOpen(true);
        setMessages([]);
        await loadChatHistory(existingSession);
      } else {
        setShowForm(true);
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  };

  /**
   * Validate pre-chat form data
   * Returns true if all required fields are valid
   */
  const validateForm = (): boolean => {
    const errors: Partial<PreChatFormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    // Validate phone number if provided (only numbers allowed)
    if (formData.contact_number && formData.contact_number.trim()) {
      if (!/^\d+$/.test(formData.contact_number.trim())) {
        errors.contact_number = 'Phone number must contain only numbers';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle pre-chat form submission
   * Creates new session and initiates conversation
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/save-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.session_id) {
        // Store session data in sessionStorage (cleared on browser close)
        sessionStorage.setItem('session_id', data.session_id);
        sessionStorage.setItem('user_name', formData.name);
        sessionStorage.setItem('user_email', formData.email);
        
        setSessionId(data.session_id);
        setShowForm(false);
        setMessages([]);
        
        // Send initial greeting message
        await sendFirstMessage(data.session_id, formData.name, formData.email);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({ name: 'Failed to start chat. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send initial greeting message to start conversation
   * Called after successful form submission
   */
  const sendFirstMessage = async (session_id: string, name: string, email: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hi',
          name,
          email,
          session_id
        }),
      });

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: data.response || 'Hello! How can I assist you today?',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages([botMessage]);
    } catch (error) {
      console.error('Error sending first message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle sending user message
   * Sends message to API and displays bot response
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId
        }),
      });

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form input changes and clear errors
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone number field, only allow numeric input
    if (name === 'contact_number') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (formErrors[name as keyof PreChatFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Close chatbot modal
   */
  const handleClose = () => {
    setIsOpen(false);
  };

  /**
   * Start a new conversation
   * Clears session data and resets to form view
   */
  const handleNewConversation = () => {
    // Clear session storage
    sessionStorage.removeItem('session_id');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_email');
    
    // Reset all state
    setSessionId(null);
    setMessages([]);
    setShowForm(true);
    setFormData({
      name: '',
      email: '',
      contact_number: ''
    });
    setFormErrors({});
  };

  return (
    <>
      {/* Chatbot Button - Positioned above scroll-to-top */}
      <button
        onClick={toggleChatbot}
        className="chatbot-trigger"
        aria-label="Chat With Us"
        type="button"
      >
        <span className="chatbot-trigger__text">Chat With Us</span>
        <svg className="chatbot-trigger__icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
        </svg>
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-modal__container">
            {/* Header */}
            <div className="chatbot-modal__header">
              <div className="chatbot-modal__logo">
                <Image
                  src={`${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new'}/wp-content/uploads/2026/01/Moreyeahs-Logo-7.png`}
                  alt="MoreYeahs Logo"
                  width={140}
                  height={40}
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.chatbot-modal__logo-text')) {
                      const textLogo = document.createElement('div');
                      textLogo.className = 'chatbot-modal__logo-text';
                      textLogo.innerHTML = '<span class="logo-more">more</span><span class="logo-yeahs">Yeahs</span>';
                      parent.appendChild(textLogo);
                    }
                  }}
                />
              </div>
              
              <div className="chatbot-modal__header-actions">
                {/* New Conversation Button - Only show when not in form */}
                {/* {!showForm && sessionId && (
                  <button
                    onClick={handleNewConversation}
                    className="chatbot-modal__new-chat"
                    aria-label="New Conversation"
                    type="button"
                    title="Start New Conversation"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
                    </svg>
                  </button>
                )} */}
                
                <button
                  onClick={handleClose}
                  className="chatbot-modal__close"
                  aria-label="Close chat"
                  type="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="chatbot-modal__content">
              {showForm ? (
                /* Pre-Chat Form */
                <div className="chatbot-form">
                    <form onSubmit={handleFormSubmit} className="chatbot-form__form">
                      <div className="chatbot-form__group">
                        <label htmlFor="name" className="chatbot-form__label">
                          Name <span className="chatbot-form__required">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          className={`chatbot-form__input ${formErrors.name ? 'chatbot-form__input--error' : ''}`}
                          disabled={isLoading}
                          required
                        />
                        {formErrors.name && (
                          <span className="chatbot-form__error">{formErrors.name}</span>
                        )}
                      </div>

                      <div className="chatbot-form__group">
                        <label htmlFor="email" className="chatbot-form__label">
                          Email <span className="chatbot-form__required">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your mail"
                          className={`chatbot-form__input ${formErrors.email ? 'chatbot-form__input--error' : ''}`}
                          disabled={isLoading}
                          required
                        />
                        {formErrors.email && (
                          <span className="chatbot-form__error">{formErrors.email}</span>
                        )}
                      </div>

                      <div className="chatbot-form__group">
                        <label htmlFor="contact_number" className="chatbot-form__label">Phone Number</label>
                        <input
                          type="tel"
                          id="contact_number"
                          name="contact_number"
                          value={formData.contact_number}
                          onChange={handleInputChange}
                          placeholder="Enter your number"
                          className={`chatbot-form__input ${formErrors.contact_number ? 'chatbot-form__input--error' : ''}`}
                          disabled={isLoading}
                          pattern="\d*"
                          inputMode="numeric"
                        />
                        {formErrors.contact_number && (
                          <span className="chatbot-form__error">{formErrors.contact_number}</span>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="chatbot-form__submit"
                        disabled={isLoading}
                      >
                        <span>Start Chat</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </form>
                  </div>
              ) : (
                /* Chat Interface */
                <div className="chatbot-chat">
                    <div className="chatbot-chat__messages">
                      {/* History Loading State */}
                      {isLoadingHistory && (
                        <div className="chatbot-history-loader">
                          <div className="chatbot-history-loader__content">
                            <div className="chatbot-history-loader__spinner">
                              <div className="spinner-ring"></div>
                              <div className="spinner-ring"></div>
                              <div className="spinner-ring"></div>
                            </div>
                            <p className="chatbot-history-loader__text">Loading your conversation...</p>
                          </div>
                        </div>
                      )}

                      {!isLoadingHistory && messages.length === 0 && !isLoading && (
                        <div className="chatbot-chat__empty">
                          <p>Ready when you are.</p>
                        </div>
                      )}
                      
                      {!isLoadingHistory && messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`chatbot-message chatbot-message--${msg.sender}`}
                        >
                          {msg.sender === 'bot' && (
                            <div className="chatbot-message__icon">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2Z" fill="currentColor"/>
                                <path d="M19 14L20.09 17.26L23 18L20.09 18.74L19 22L17.91 18.74L15 18L17.91 17.26L19 14Z" fill="currentColor"/>
                              </svg>
                            </div>
                          )}
                          <div className="chatbot-message__content">
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="chatbot-message chatbot-message--bot">
                          <div className="chatbot-message__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2Z" fill="currentColor"/>
                              <path d="M19 14L20.09 17.26L23 18L20.09 18.74L19 22L17.91 18.74L15 18L17.91 17.26L19 14Z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div className="chatbot-message__content">
                            <div className="chatbot-typing">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="chatbot-chat__input-form">
                      <input
                        ref={chatInputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask Anything"
                        disabled={isLoading}
                        className="chatbot-chat__input"
                      />
                      <button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="chatbot-chat__send"
                        aria-label="Send message"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </form>
                  </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
