/*
import { useEffect, useState, type JSX } from 'react';
import { refreshAccessToken } from '../api/authApi';
import { useNavigate } from '@tanstack/react-router';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      try {
        const token = sessionStorage.getItem('access_token');
        if (!token) await refreshAccessToken();
        setAuthorized(true);
      } catch (err) {
        navigate({ to: '/login' });
      }
    }
    verify();
  }, []);

  if (!authorized) return <div>Loading...</div>;
  return children;
}
*/