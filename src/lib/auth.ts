import { User } from '../types/auth';
import { mockDb } from './mockDb';

const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('auth-store');
    
    const user = getCurrentUser();
    if (user?.tenantId) {
      mockDb.clearTenantData(user.tenantId);
    }
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const token = getAuthToken();
    if (!token) return null;
    
    // Parse base64 encoded token
    const decoded = JSON.parse(atob(token));
    
    if (decoded.exp && decoded.exp < Date.now()) {
      removeAuthToken();
      return null;
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      tenantId: decoded.tenantId,
      createdAt: decoded.iat ? new Date(decoded.iat).toISOString() : new Date().toISOString(),
      updatedAt: decoded.iat ? new Date(decoded.iat).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    removeAuthToken();
    return null;
  }
};

export const validateToken = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return !!user && !!user.tenantId;
};