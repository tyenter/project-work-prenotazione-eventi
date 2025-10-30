import { WithId } from 'mongodb';
import { COLLECTION_CREDS } from '../config';
import { connectDB } from '../db';
import { InternalServerError, Unauthorized } from '../errors/errors';
import { ICredentials, IUserInfoPOST } from '../models/models';
import { generateTokens, hashPassword, verifyPassword } from '../utils/functions';
import crypto from "crypto";
import sanitizeHtml from "sanitize-html";


export class AuthService {
    public async handleLogin(email: string,password: string){
        const db = await connectDB()
        const credsColletion = db.collection<ICredentials>(COLLECTION_CREDS);

        const normalizedEmail = email.toLowerCase()

        const user: WithId<ICredentials> | null = await credsColletion.findOne({email: normalizedEmail})

        if(!user)
            throw new Unauthorized("invalid credentials")

        const canLogin = await verifyPassword(password,user.password)

        if(!canLogin)
            throw new Unauthorized("invalid credentials")

        // login effettuato -> immagazzino refresh token nel DB
        const {accessToken, refreshToken} = generateTokens(user._id)

        const hashedRefreshToken = this.hashToken(refreshToken)
        
        const result = await credsColletion.updateOne(
            { _id: user._id}, 
            { $set: { refreshToken: hashedRefreshToken } }
        );

        if(result.matchedCount === 0 || result.modifiedCount === 0)
            throw new InternalServerError("internal server error")

        return {accessToken, refreshToken}
    }

    public async handleSignup(userInfo: IUserInfoPOST){
        const db = await connectDB()
        const credsColletion = db.collection<ICredentials>(COLLECTION_CREDS); 

        let newUser: ICredentials = {
            email: userInfo.email.toLowerCase(),
            password: await hashPassword(userInfo.password),
            firstName: sanitizeHtml(userInfo.firstName),
            lastName: sanitizeHtml(userInfo.lastName)
        }
        
        const {insertedId} = await credsColletion.insertOne(newUser)

        // signup effettuato -> immagazzino refresh token nel DB
        const {accessToken, refreshToken} = generateTokens(insertedId)

        const hashedRefreshToken = this.hashToken(refreshToken)
        
        const result = await credsColletion.updateOne(
            { _id: insertedId}, 
            { $set: { refreshToken: hashedRefreshToken } }
        );

        if(result.matchedCount === 0 || result.modifiedCount === 0)
            throw new InternalServerError("internal server error")

        return {accessToken, refreshToken}
    }

    public async handleRefresh(refreshToken: string){
        const db = await connectDB()
        const credsColletion = db.collection<ICredentials>(COLLECTION_CREDS);

        const hashedRefreshToken = this.hashToken(refreshToken)

        const user: WithId<ICredentials> | null = await credsColletion.findOne({ refreshToken: hashedRefreshToken });
        if (!user)
            throw new Unauthorized("invalid refresh token")

        // token valido -> creo nuovi token e immagazzino nuovo refresh token nel DB
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        const newHashedRefreshToken = this.hashToken(newRefreshToken)

        const result = await credsColletion.updateOne(
            { _id: user._id },
            { $set: { refreshToken: newHashedRefreshToken } }
        );

        if(result.matchedCount === 0 || result.modifiedCount === 0)
            throw new InternalServerError("internal server error")

        return {accessToken, newRefreshToken}
    }

    private hashToken(token: string){
        return crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
    }
}
