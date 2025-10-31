import axiosClient from './axiosClient';
import { z } from 'zod';

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export async function login(email: string, password: string) {
  const response = await axiosClient.post('/auth/login', { email, password });
  /*
  const result = loginResponseSchema.parse(response.data); 
  sessionStorage.setItem('accessToken', result.accessToken);
  */
}

export async function logout() {
  await axiosClient.post('/auth/logout');
  sessionStorage.removeItem('accessToken');
}

export async function refreshAccessToken() {
  const response = await axiosClient.post('/auth/refresh');
  const result = loginResponseSchema.parse(response.data);
  sessionStorage.setItem('accessToken', result.accessToken);
  return result.accessToken;
}
