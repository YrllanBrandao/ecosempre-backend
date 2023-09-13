import express, { Router, Request, Response } from 'express';
const categoryRoutes: Router = express.Router();
import CategoryCollectionPoints from '../models/categoryCollectionPoints';


import Middleware from '../auth/middleware';






const middleware:Middleware = new Middleware();

categoryRoutes.get("/categories-collection-points", async(req:Request, res:Response)=>{
    const categoryCollectionPoints:CategoryCollectionPoints = new CategoryCollectionPoints();

    categoryCollectionPoints.getAll(req, res);
})

categoryRoutes.post("/category-collection-points", middleware.handle, async(req:Request, res:Response)=>{
    const categoryCollectionPoints:CategoryCollectionPoints = new CategoryCollectionPoints();

    categoryCollectionPoints.createCategory(req, res);
})

categoryRoutes.delete("/category-collection-points", middleware.handle, async(req:Request, res:Response)=>{
    const categoryCollectionPoints:CategoryCollectionPoints = new CategoryCollectionPoints();

    categoryCollectionPoints.delete(req, res);
})
categoryRoutes.put("/category-collection-points", middleware.handle, async(req:Request, res:Response)=>{
    const categoryCollectionPoints:CategoryCollectionPoints = new CategoryCollectionPoints();

    categoryCollectionPoints.update(req, res);
})


export default categoryRoutes;