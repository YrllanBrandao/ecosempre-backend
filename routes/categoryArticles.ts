import express, { Router, Request, Response } from 'express';
import CategoryArticles from '../models/categoryArticles';
import Middleware from '../auth/middleware';
const categoryArticlessRoutes: Router = express.Router();




const middleware:Middleware = new Middleware();

categoryArticlessRoutes.post("/category-article", middleware.handle, async(req:Request, res:Response)=>{
    const categoryArticles:CategoryArticles = new CategoryArticles();
    categoryArticles.createCategory(req, res);
})
categoryArticlessRoutes.get("/category-article", async(req:Request, res:Response)=>{
    const categoryArticles:CategoryArticles = new CategoryArticles();
    categoryArticles.getCategories(req, res);
})

export default categoryArticlessRoutes;