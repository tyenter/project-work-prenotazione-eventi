import axios from 'axios';
import type { TLoginError } from '../models/models';
import { useAxios } from './useAxios';
import { useAuth } from './useAuth';
import z from 'zod';

type TypeOfAuth = "login" | "signup"

type TPayload = {
  email: string, 
  password: string, 
  firstName?: string, 
  lastName?: string
}

export const authenticateMe = (typeOfAuth: TypeOfAuth) => {
  const { setAccessToken } = useAuth();
  const axiosClient = useAxios();
  const responseSchema = z.object({
    accessToken: z.string(),
  });

  return async (info: TPayload): Promise<undefined | TLoginError> => {
    try {
      let payload: TPayload  = info
      if(typeOfAuth === "signup")
        payload = {...payload,firstName: info.firstName,lastName: info.lastName}

      const {data} = await axiosClient.post(`/auth/${typeOfAuth}`, payload);
      const response = responseSchema.parse(data);
      setAccessToken(response.accessToken);
    } catch (err) {
      if (axios.isAxiosError(err)){
        if (err.response) {
          if(err.response.status === 401 || err.response.status === 400) return "INVALID_CREDENTIALS"
          else if (err.response.status === 400) return "BAD_REQUEST"
          else return "SERVER_ERROR"
        } 
        else if (err.request) return "NETWORK_ERROR"
        else return "AXIOS_ERROR"
      }
    }
  };
};


