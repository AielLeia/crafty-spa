import { selectIsUserAuthenticated } from '@/libs/auth/reducer.ts';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const RedirectHome = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [navigate, isAuthenticated]);

  return null;
};
