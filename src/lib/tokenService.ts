import { jwtDecode } from 'jwt-decode';
import { User } from '../types/auth';
import { nanoid } from 'nanoid';

// Constants for token configuration
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface TokenPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  type: 'access' | 'refresh';
  exp: number;
  iat: number;
  jti: string;
}

export class TokenService {
  private static instance: TokenService;
  
  private constructor() {}
  
  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Generate access and refresh tokens for a user
   */
  public generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const basePayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      iat: Date.now(),
      jti: nanoid(),
    };

    const accessToken = this.encodeToken({
      ...basePayload,
      type: 'access',
      exp: Date.now() + TOKEN_EXPIRY,
    });

    const refreshToken = this.encodeToken({
      ...basePayload,
      type: 'refresh',
      exp: Date.now() + REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Encode a token payload
   */
  private encodeToken(payload: TokenPayload): string {
    return btoa(JSON.stringify(payload));
  }

  /**
   * Decode a token
   */
  private decodeToken(token: string): TokenPayload {
    try {
      return JSON.parse(atob(token));
    } catch {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Verify and decode a token
   */
  public verifyToken(token: string): TokenPayload {
    try {
      const decoded = this.decodeToken(token);
      
      if (!decoded.exp || decoded.exp < Date.now()) {
        throw new Error('Token expired');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Validate a token without throwing
   */
  public validateToken(token: string): boolean {
    try {
      this.verifyToken(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Refresh an access token using a refresh token
   */
  public refreshAccessToken(refreshToken: string): string {
    try {
      const decoded = this.verifyToken(refreshToken);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const user: User = {
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role as User['role'],
        tenantId: decoded.tenantId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { accessToken } = this.generateTokens(user);
      return accessToken;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Get user data from a token
   */
  public getUserFromToken(token: string): User | null {
    try {
      const decoded = this.verifyToken(token);
      return {
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role as User['role'],
        tenantId: decoded.tenantId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const tokenService = TokenService.getInstance();