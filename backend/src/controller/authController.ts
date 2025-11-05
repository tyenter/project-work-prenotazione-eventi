import { NextFunction, Request, Response } from 'express';
import { credsSchema, refreshTokenSchema, userInfoSchema } from './joiSchemas';
import { BadRequest, Unauthorized } from '../errors/errors';
import { AuthService } from '../service/authService';
import jwt from "jsonwebtoken"; 
import { ADMIN_EMAIL, JWT_REFRESH_SECRET } from '../config';

export class AuthController {

    private authService = new AuthService()

    public manageLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const body = req.body

            if(!req.body.email || !req.body.password)
                throw new BadRequest("email or password missing")

            const credentials = {
                email: req.body.email,
                password: req.body.password
            }
            const {error} = credsSchema.validate(credentials,{ stripUnknown: true })
            if(error)
                throw new Unauthorized("invalid credentials")

            const {accessToken, refreshToken} =
                await this.authService.handleLogin(credentials.email,credentials.password)

            // refresh token
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/auth",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
            });

            // access token
            res.status(200).json({ accessToken });
        }catch(err){
            console.error("Login Error: ",err)
            next(err)
        }
    }

    public manageRefresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) 
               throw new Unauthorized("No refresh token");

            const {error} = refreshTokenSchema.validate(refreshToken)
            if(error)
                throw new Unauthorized("invalid refresh token")

            try {
                jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            } catch (err) {
                throw new Unauthorized("invalid refresh token");
            }

            const {accessToken, newRefreshToken} = 
                await this.authService.handleRefresh(refreshToken)

            // nuovo refresh token
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/auth",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
            });

            // nuovo access token
            res.status(200).json({ accessToken });
        }catch(err){
            console.error("Refresh Error: ",err)
            next(err)
        }
    }

    public manageSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userInfo = req.body

            const {error, value: validUserInfo} = 
                userInfoSchema.validate(userInfo, { stripUnknown: true })
            if(error)
                throw new BadRequest("invalid user info") 

            // nel caso la chiave unique fallisse per qualche motivo
            if(validUserInfo.email === ADMIN_EMAIL)
                throw new BadRequest("invalid user info") 
            
            const {accessToken, refreshToken} = 
                await this.authService.handleSignup(validUserInfo)

            // refresh token
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/auth",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
            });

            // access token
            res.status(200).json({ accessToken });
        } catch(err: any){
            console.error("Signup Error: ",err)
            next(err)
        }
    }

    public manageLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) 
               res.sendStatus(200);
            
            await this.authService.handleLogout(refreshToken)

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/auth', 
            });

            res.sendStatus(200);
        } catch(err: any){
            console.error("Logout Error: ",err)
            next(err)
        }
    }
}