import axios from 'axios';
import type { TLoginError } from '../models/models';
import { useAxios } from './useAxios';
import { useAuth } from './useAuth';
import z from 'zod';

export const useLogin = () => {
  const { setAccessToken } = useAuth();
  const axiosClient = useAxios();
  const loginResponseSchema = z.object({
    accessToken: z.string(),
  });

  return async (email: string, password: string): Promise<undefined | TLoginError> => {
    try {
      const {data} = await axiosClient.post('/auth/login', { email, password });
      const result = loginResponseSchema.parse(data);
      setAccessToken(result.accessToken);
    } catch (err) {
      if (axios.isAxiosError(err)){
        if (err.response) {
          if(err.response.status === 401) return "INVALID_CREDENTIALS"
          else if (err.response.status === 400) return "BAD_REQUEST"
          else return "SERVER_ERROR"
        } 
        else if (err.request) return "NETWORK_ERROR"
        else return "AXIOS_ERROR"
      }
    }
  };
};

// export async function logout() {
//   await axiosClient.post('/auth/logout');
//   sessionStorage.removeItem('accessToken');
// }

// export async function refreshAccessToken() {
//   const response = await axiosClient.post('/auth/refresh');
//   const result = loginResponseSchema.parse(response.data);
//   sessionStorage.setItem('accessToken', result.accessToken);
//   return result.accessToken;
// }
