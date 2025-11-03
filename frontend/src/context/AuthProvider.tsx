import { type PropsWithChildren ,createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // durante l'avvio, cerco di ricaricare l'access token 
  // usando il cookie HttpOnly
  useEffect(() => {
    const refresh = async () => {
      try {
        const { data } = await axiosClient.post(
          '/auth/refresh',
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    refresh();
  }, []);

  const value = { accessToken, setAccessToken};

  if (loading) return <div>Caricamento...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

