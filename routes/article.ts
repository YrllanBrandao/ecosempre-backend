import express, { Router, Request, Response, NextFunction } from 'express';
import Article from '../models/article';
import Middleware from '../auth/middleware';
const articleRoutes: Router = express.Router();




const middleware:Middleware = new Middleware();

articleRoutes.get("/articles",  async (req: Request, res: Response) => {
    const article: Article = new Article();
    article.getArticles(req, res);
})


articleRoutes.post("/article", middleware.handle, async (req: Request, res: Response) => {
    const article: Article = new Article();
    article.createArticle(req, res);

})

articleRoutes.get("/article/:key", async (req: Request, res: Response) => {
    const article: Article = new Article();
    article.getArticleByKey(req, res);
})
articleRoutes.delete("/article/:id", middleware.handle, async (req: Request, res: Response) => {
    const article: Article = new Article();
    article.deleteArticle(req, res);
})
articleRoutes.put("/article/:id", middleware.handle, async (req: Request, res: Response) => {
    const article: Article = new Article();
    article.updateArticle(req, res);
})
// get articles by key
articleRoutes.get("/articles/category/:category", async (req: Request, res: Response) => {
    const article: Article = new Article();
    article.getArticlesByCategory(req, res);
})
articleRoutes.get("/articles/tag/:tag",  async (req: Request, res: Response) => {
    const article: Article = new Article();
    article.getArticlesByTag(req, res);
})

export default articleRoutes;