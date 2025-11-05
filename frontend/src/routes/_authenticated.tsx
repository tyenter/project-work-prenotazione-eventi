import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import axiosClient from '../api/axiosClient';
import { AxiosError } from 'axios';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {

    if (!context.accessToken) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname + location.search,
        },
      });
    }

    const isTokenValid = await validateAccessToken(context.accessToken);

    if (!isTokenValid) {
      try {
        const newAccessToken = await refreshAccessToken();

        context.setAccessToken(newAccessToken);

        await validateAccessToken(newAccessToken);
      } catch (err) {
        console.error('Token refresh failed');
        throw redirect({
          to: '/login',
          search: {
            redirect: location.pathname + location.search,
          },
        });
      }
    }
  },
  component: () => <Outlet />,
});

const refreshAccessToken = async () => {
  const { data } = await axiosClient.post("/auth/refresh");
  return data.accessToken;
};

const validateAccessToken = async (accessToken: string) => {
  try {
    await axiosClient.post("/admin", {}, { headers: { Authorization: `Bearer ${accessToken}` } });
  } catch (err) {
    if (err instanceof AxiosError)
      if(err.response?.status === 401)
        return false; 
      
      throw redirect({to: "/eventi"})
  }
};
