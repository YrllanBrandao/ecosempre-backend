import express, { Router, Request, Response } from 'express';
import Tag from '../models/tag';
import Middleware from '../auth/middleware';
const tagRoutes: Router = express.Router();




const middleware:Middleware = new Middleware();

tagRoutes.post("/tag", middleware.handle, async(req:Request, res:Response)=>{
    const tag:Tag = new Tag();
    tag.createTag(req, res);
})
tagRoutes.delete("/tag", middleware.handle, async(req:Request, res:Response)=>{
    const tag:Tag = new Tag();
    tag.deleteTag(req, res);
})
tagRoutes.put("/tag", middleware.handle, async(req:Request, res:Response)=>{
    const tag:Tag = new Tag();
    tag.updateTag(req, res);
})
tagRoutes.get("/tags", async(req:Request, res:Response)=>{
    const tag:Tag = new Tag();
    tag.getTags(req, res);
})

export default tagRoutes;