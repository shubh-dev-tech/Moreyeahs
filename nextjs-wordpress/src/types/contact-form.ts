/**
 * Contact Form TypeScript Interfaces
 */

export interface ContactFormData {
  email: string;
  phone: string;
  message: string;
}

export interface ContactFormSuccessResponse {
  success: true;
  message: string;
  data: {
    submission_id: number;
    email: string;
  };
}

export interface ContactFormErrorResponse {
  code: string;
  message: string;
  data: {
    status: number;
    errors?: string[];
  };
}

export type ContactFormResponse = ContactFormSuccessResponse | ContactFormErrorResponse;

export interface ContactFormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  responseMessage: string;
}
