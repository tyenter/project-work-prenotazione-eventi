import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string,
        iat?: number;
        exp?: number;
      }
    }
  }
}
