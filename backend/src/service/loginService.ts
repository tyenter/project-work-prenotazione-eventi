import { COLLECTION_CREDS } from '../config';
import { connectDB } from '../db';
import { Unauthorized } from '../errors/errors';
import { verifyPassword } from '../utils/functions';

export class LoginService {
    public async checkCredentials(email: string,password: string){
        const db = await connectDB()
        const credsColletion = db.collection(COLLECTION_CREDS); // tmp type <????>

        const creds = await credsColletion.findOne({email: email}) // tmp type

        if(!creds)
            throw new Unauthorized("wrong credentials")

        const canLogin = await verifyPassword(password,creds.password)

        if(!canLogin)
            throw new Unauthorized("wrong credentials")
    }
}
