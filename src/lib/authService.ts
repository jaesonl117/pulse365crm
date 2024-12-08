import { tokenService } from './tokenService';
import { User } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export class AuthService {
  private static instance: AuthService;
  
  private constructor() {}
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Set authentication tokens in storage
   */
  public setAuthTokens(accessToken: string, refreshToken: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error setting auth tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get the current access token
   */
  public getAccessToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get the current refresh token
   */
  public getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  public clearAuth(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('auth-store');
      
      // Clear any other auth-related storage here
      const user = this.getCurrentUser();
      if (user?.tenantId) {
        // Implement tenant data clearing if needed
      }
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Get the current authenticated user
   */
  public getCurrentUser(): User | null {
    try {
      const token = this.getAccessToken();
      if (!token) return null;
      
      return tokenService.getUserFromToken(token);
    } catch (error) {
      console.error('Error getting current user:', error);
      this.clearAuth();
      return null;
    }
  }

  /**
   * Check if there is an authenticated user
   */
  public isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user && !!user.tenantId;
  }

  /**
   * Refresh the access token using the refresh token
   */
  public async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.clearAuth();
        return null;
      }

      const newAccessToken = tokenService.refreshAccessToken(refreshToken);
      localStorage.setItem(TOKEN_KEY, newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      this.clearAuth();
      return null;
    }
  }

  /**
   * Initialize the authentication state
   */
  public async initializeAuth(): Promise<User | null> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        const newAccessToken = await this.refreshAccessToken();
        if (!newAccessToken) {
          return null;
        }
        return tokenService.getUserFromToken(newAccessToken);
      }
      return currentUser;
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.clearAuth();
      return null;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();