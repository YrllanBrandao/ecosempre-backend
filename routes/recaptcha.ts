import express, { Router, Request, Response } from 'express';
import Recaptcha from '../models/recaptcha';
import Middleware from '../auth/middleware';
const recaptchaRoutes: Router = express.Router();




const middleware:Middleware = new Middleware();

recaptchaRoutes.post("/recaptcha-verify", async (req: Request, res: Response) => {
    const recaptcha:Recaptcha = new Recaptcha();

    recaptcha.compareResponses(req, res);
})


export default recaptchaRoutes;