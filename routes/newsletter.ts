import express, { Router, Request, Response, NextFunction } from 'express';
import Newsletter from '../models/newsletter';
import Middleware from '../auth/middleware';
const newsletterRoutes: Router = express.Router();




const middleware:Middleware = new Middleware();

newsletterRoutes.post("/newsletter", async(req:Request, res:Response)=>{
    const newsletter:Newsletter = new Newsletter();
    newsletter.registerEmail(req, res);
})
newsletterRoutes.delete("/newsletter", middleware.handle, async(req:Request, res:Response)=>{
    const newsletter:Newsletter = new Newsletter();
    newsletter.deleteEmail(req, res);
})
newsletterRoutes.get("/newsletter", middleware.handle,  async(req:Request, res:Response)=>{
    const newsletter:Newsletter = new Newsletter();
    newsletter.getAll(req, res);
})

newsletterRoutes.get("/unsubscribe", async (req:Request, res:Response)=>{
    const newsletter:Newsletter = new Newsletter();
    newsletter.deleteEmailFromNewsletter(req, res);
})

export default newsletterRoutes;