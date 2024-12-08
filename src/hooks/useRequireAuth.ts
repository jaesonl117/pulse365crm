import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useRequireAuth = (redirectTo: string = '/login') => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate(redirectTo);
    }
  }, [currentUser, loading, navigate, redirectTo]);

  return { currentUser, loading };
};