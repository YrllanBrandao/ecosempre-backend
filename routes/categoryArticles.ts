import express, { Router, Request, Response } from 'express';
import CategoryArticle from '../models/categoryArticle';
import Middleware from '../auth/middleware';
const categoryArticlesRoutes: Router = express.Router();




const middleware:Middleware = new Middleware();

categoryArticlesRoutes.post("/category-article", middleware.handle, async(req:Request, res:Response)=>{
    const categoryArticle:CategoryArticle = new CategoryArticle();
    categoryArticle.createCategory(req, res);
})
categoryArticlesRoutes.get("/category-article", async(req:Request, res:Response)=>{
    const categoryArticle:CategoryArticle = new CategoryArticle();
    categoryArticle.getCategories(req, res);
})

export default categoryArticlesRoutes;