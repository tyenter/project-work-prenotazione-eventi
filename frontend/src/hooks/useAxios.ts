import { useAuth } from './useAuth';
import axiosClient from '../api/axiosClient';
import type { AxiosInstance } from 'axios';
import { useEffect, useRef } from 'react';

export const useAxios = (): AxiosInstance => {
  const { accessToken, setAccessToken } = useAuth();
  const tokenRef = useRef(accessToken);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    const reqInterceptor = axiosClient.interceptors.request.use((config) => {
      const token = tokenRef.current;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const resInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (originalRequest._retry || originalRequest.url === '/auth/refresh') {
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          originalRequest._retry = true;

          try {
            const { data } = await axiosClient.post('/auth/refresh', {}, { withCredentials: true });

            if (!data?.accessToken || typeof data.accessToken !== "string") {
              setAccessToken(null);
              return Promise.reject(new Error('No access token returned from refresh'));
            }

            setAccessToken(data.accessToken);
            tokenRef.current = data.accessToken;

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axiosClient(originalRequest);
          } catch (refreshError) {
            setAccessToken(null);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(reqInterceptor);
      axiosClient.interceptors.response.eject(resInterceptor);
    };
  }, [setAccessToken]);

  return axiosClient;
};