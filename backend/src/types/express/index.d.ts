import express from "express";

type TokenInfo = {
  sub: string,
  role?: string,
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenInfo
    }
  }
}
