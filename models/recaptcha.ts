import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';


interface IRecaptchaVerify {
    secret: string;
    response: string;
}

interface IRecaptchaResponse {
    success: boolean;
}

class Recaptcha {
    public verify_url = 'https://www.google.com/recaptcha/api/siteverify';
    public async compareResponses(req: Request, res: Response) {
        try {
            const { recaptchaToken } = req.body
            const data: IRecaptchaVerify = {
                secret: process.env.RECAPTCHA_SERVER_SECRET!,
                response: recaptchaToken
            }
            const response: object | any = await axios.post(this.verify_url, data);
            res.status(200).json(response.data);

        }
        catch (error: any) {
            res.status(400).send(error.message);
        }
    }
}

export default Recaptcha;