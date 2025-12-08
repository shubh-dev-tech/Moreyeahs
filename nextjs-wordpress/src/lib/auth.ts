// Authentication utilities for JWT and nonce management

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  display_name: string;
  roles: string[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  nonce: string;
  user: AuthUser;
  expires_in: number;
}

export interface TokenValidation {
  valid: boolean;
  user_id?: number;
  expires_at?: number;
  message?: string;
}

const WORDPRESS_API_URL = process.env.WORDPRESS_REST_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;

export class AuthService {
  private static TOKEN_KEY = 'jwt_token';
  private static NONCE_KEY = 'wp_nonce';
  private static USER_KEY = 'auth_user';
  
  // Login with username and password
  static async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }
    
    const data: AuthResponse = await response.json();
    
    // Store in localStorage (client-side only)
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.NONCE_KEY, data.nonce);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    }
    
    return data;
  }
  
  // Logout
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.NONCE_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }
  
  // Get stored token
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  
  // Get stored nonce
  static getNonce(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.NONCE_KEY);
    }
    return null;
  }
  
  // Get stored user
  static getUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
  
  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  // Validate token
  static async validateToken(token?: string): Promise<TokenValidation> {
    const authToken = token || this.getToken();
    
    if (!authToken) {
      return { valid: false, message: 'No token found' };
    }
    
    try {
      const response = await fetch(`${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authToken }),
      });
      
      const data: TokenValidation = await response.json();
      return data;
    } catch (error) {
      return { valid: false, message: 'Validation failed' };
    }
  }
  
  // Refresh token
  static async refreshToken(): Promise<AuthResponse> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No token to refresh');
    }
    
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data: AuthResponse = await response.json();
    
    // Update stored credentials
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.NONCE_KEY, data.nonce);
    }
    
    return data;
  }
  
  // Get fresh nonce
  static async fetchNonce(): Promise<string> {
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/nonce`);
    const data = await response.json();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.NONCE_KEY, data.nonce);
    }
    
    return data.nonce;
  }
  
  // Make authenticated request
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    const nonce = this.getNonce();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    // Add existing headers
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      });
    }
    
    // Add nonce for write operations
    if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
      if (nonce) {
        headers['X-WP-Nonce'] = nonce;
      }
    }
    
    return fetch(url, {
      ...options,
      headers,
    });
  }
}
