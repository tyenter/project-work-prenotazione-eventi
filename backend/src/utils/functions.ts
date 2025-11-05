import bcrypt from "bcrypt"
import { ADMIN_EMAIL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateTokens = (userId: ObjectId, userEmail?: string, userRole?: string) => {

  let payload: {sub:string} | {sub:string,role:string} = { 
    sub: userId.toString(),
  }
  if(userRole === "admin" && userEmail === ADMIN_EMAIL)
    payload = {...payload, role: "admin"}

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET!, {
    algorithm: "HS256",
    expiresIn: "3m" 
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET!, {
    algorithm: "HS256",
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};