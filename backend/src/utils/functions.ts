import bcrypt from "bcrypt"
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateTokens = (userId: ObjectId) => {
  const payload = { sub: userId.toString() };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET!, {
    algorithm: "HS256",
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET!, {
      algorithm: "HS256",
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};