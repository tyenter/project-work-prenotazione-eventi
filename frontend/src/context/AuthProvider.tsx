// AuthProvider.tsx
import axios from 'axios';
import { type PropsWithChildren ,createContext, useState, useEffect } from 'react';

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
    const axiosClient = axios.create({
        baseURL: 'https://localhost:8443',
        withCredentials: true,
    });

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

  const value = { accessToken, setAccessToken };

  if (loading) return <div>Caricamento...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

