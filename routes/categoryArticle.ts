import express, { Router, Request, Response } from 'express';
import CategoryArticle from '../models/categoryArticle';
import Middleware from '../auth/middleware';
const categoryArticleRoutes: Router = express.Router();




const middleware:Middleware = new Middleware();

categoryArticleRoutes.post("/category-article", middleware.handle, async(req:Request, res:Response)=>{
    const categoryArticle:CategoryArticle = new CategoryArticle();
    categoryArticle.createCategory(req, res);
})


export default categoryArticleRoutes;