import axiosClient from '../api/axiosClient';
import { useAuth } from './useAuth';

export const useLogout = () => {
  const { setAccessToken } = useAuth();

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Error during logout');
    } finally {
      setAccessToken(null);
    }
  };

  return { logout };
};
