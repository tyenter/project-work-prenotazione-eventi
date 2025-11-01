import type { AxiosInstance } from 'axios';
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';

export const useAxios = (): AxiosInstance => {
  const { accessToken, setAccessToken} = useAuth();

  return useMemo(() => {
    const client = axios.create({
      baseURL: 'https://localhost:8443',
      withCredentials: true,
    });

    client.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    client.interceptors.response.use(
      res => res,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== '/auth/login'
        ) {
          originalRequest._retry = true;

          try {
            const { data } = await client.post('/auth/refresh', {}, { withCredentials: true });
            if (!data?.accessToken) {
              setAccessToken(null);
              return Promise.reject(new Error('No access token returned from refresh'));
            }
            setAccessToken(data.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
            return client(originalRequest);
          } catch {
            setAccessToken(null); 
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return client;
  }, [accessToken]);
};



