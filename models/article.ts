import slugify from 'slugify';
import { Request, Response } from "express";

import Static from "../static";
import Connection from "../database/connection";
import Mailer from '../mailer';


export interface IArticle {
    id?: number;
    title: string;
    author: string;
    content: string;
    slug: string;
    author_id: number;
    createdAt ?: string;
    updatedAt ?: string;
}

interface ICategoryArticle{
    article_id: number
    category_id: number,
    createdAt: string,
    updatedAt: string
}
interface IArticleTag{
    article_id:  number;
    tag_id: number;
    createdAt: string;
    updatedAt: string;
}
interface IArticleWithTags{
    id?: number;
    title?: string;
    author?: string;
    content?: string;
    author_id?: number;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
    tags: string[];
    categories: string[];
                      
}
interface IArticleWithCategory {
    id?: number;
    title?: string;
    author?: string;
    content?: string;
    author_id?: number;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
    categories: string[];
}
class Article {
    private currentDate: string = new Static().getCurrentDate();

    private async registerArticleTags(tags:number[], articleId:number):Promise<void>
    {
      
    
       try{
        for(const tag of tags )
        {
          
           
            const register:IArticleTag = {
                article_id: articleId,
                tag_id: tag,
                createdAt: this.currentDate,
                updatedAt: this.currentDate
                
            }
           
            await Connection("articleTag").insert(register);
        }

       }
       catch(error:any)
       {
        throw error;
       }
       
    }
    private async registerCategoryArticle(categories:number[], articleId:number):Promise<void>
    {
      
    
       try{
        for(const category of categories )
        {
          
           
            const register:ICategoryArticle = {
                article_id: articleId,
                category_id: category,
                createdAt: this.currentDate,
                updatedAt: this.currentDate
            }
           
            await Connection("categoryArticle").insert(register);
        }

       }
       catch(error:any)
       {
        throw error;
       }
       
    }
    private verifyArticleByTitle = async (title: string) => {
        const exist: string[] = await Connection("articles").select("*").where({ title });


        if (exist[0] !== undefined) {
            return true;
        }
        return false;
    }
    private verifyArticleBySlug = async (slug: string) => {
        const exist: string[] = await Connection("articles").select("*").where({ slug });


        if (exist[0] !== undefined) {
            return true;
        }
        return false;
    }
    private verifyArticleById = async (id: number) => {
        const exist: string[] = await Connection("articles").select("*").where({ id });


        if (exist[0] !== undefined) {
            return true;
        }
        return false;
    }
    private articleValidate = (article: IArticle) => {
        const { title, author, content, author_id } = article;

        if (!title || !author || !content || !author_id) {
            return false;
        }
        return true;
    }
    private verifyPagination = (page?: string, limit?: string) => {
        if (limit === undefined || page === undefined) {
            return false;
        }
        return true;
    }
    private async verifyTagExistence(tag:string):Promise<boolean>{

        const  query: object | undefined =  await Connection("tags").select("*").where({name:tag}).first();

        if(query === undefined)
        {
            return false;
        }
        return true;
    }
    public creatArticle = async (req: Request, res: Response) => {

        try {
            const article: IArticle = req.body;
            const {tags_ids, categories}:{tags_ids:number[], categories:number[]} = req.body;

            const isValid: boolean = this.articleValidate(article);
            const mailer:Mailer = new Mailer();
            if (isValid) {
                const exist: boolean = await this.verifyArticleByTitle(article.title);

                if (exist) {

                    res.status(409).send("The article already exists!");
                }
                else {
                    
                    const fullArticle: object = {
                        title: article.title.toLowerCase(),
                        content: article.content,
                        author: article.author,
                        author_id: article.author_id,
                        createdAt: this.currentDate,
                        updatedAt: this.currentDate,
                        slug: slugify(article.title)
                    }

                   const articleId:number =  Number(await Connection("articles").insert(fullArticle));
                   await this.registerArticleTags(tags_ids, articleId);
                   await this.registerCategoryArticle(categories, articleId);
                    await mailer.sendBatchEmails({
                        slug: slugify(article.title),
                        title: article.title
                    })
                    


                    res.status(201).send("Created Successfully!");
                    
                }
            }
            else {
                throw new Error("is not valid");
            }

        }
        catch (error: any) {
            res.sendStatus(400);
        }
    }

    public deleteArticle = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id)

            const exist: boolean = await this.verifyArticleById(id);

            if (!exist) {
                res.status(404).send("the articles dosn't exists!");
            }

            await Connection("articles").delete("*").where({ id });
            res.status(200).send("Deleted");
        }
        catch (error: any) {
            res.status(400).send(error.sqlMessage);
        }

    }

    public async  getArticlesByTag(req:Request, res:Response)
    {
        try{
            const tag:string = req.params.tag;

            const tagExist:boolean =  await this.verifyTagExistence(tag);

            if(tagExist)
            {
                const articlesWithGivenTag: string[] = await Connection("articles").select("*")
                .innerJoin('articleTag', 'articles.id', 'articleTag.article_id')
                .innerJoin('tags', 'articleTag.tag_id', 'tags.id')
                .where('tags.name', tag);

                if(articlesWithGivenTag[0] === undefined)
                {
                    res.sendStatus(404);
                }
                else{
                    res.status(200).send(articlesWithGivenTag)
                }
            }
            else{
                throw new Error("invalid tag");
            }
        }
        catch(error:any)
        {
            res.status(400).send(error.message);
        }
           
    }       
    public async  getArticles(req: Request, res: Response) {
        try {
            const { limit, page }: { limit?: string, page?: string} = req.query;

            const pagination: boolean = this.verifyPagination(limit, page);
            if (pagination) {
                const offset = (Number(page) - 1) * Number(limit)
                const articles: string[] = await Connection("articles").select("*").orderBy("id", 'desc').limit(Number(limit)).offset(Number(offset));

                if (articles[0] === undefined) {
                    res.status(404).send("doesn't exists articles");
                }
                
                res.status(200).send(articles);
            }
            else {
                const articles: string[] = await Connection("articles").select("*");

                if (articles[0] === undefined) {
                    res.sendStatus(404);
                }
                res.status(200).send(articles);
            }
        }
        catch (error: any) {
            res.status(400).send(error.sqlMessage)
        }
    }
    public getArticleByKey = async (req: Request, res: Response) => {

        try {
            const regex: RegExp = /^\d+$/g;
            const key: string = req.params.key;
            const result: RegExpMatchArray | null = key.match(regex);

            //is string/slug
            if (result === null) {
                const exists: boolean = await this.verifyArticleBySlug(key);

                if (exists) {
                    const articleWithTags: IArticleWithTags = {
                        tags: [],
                        categories: []
                      };
                      
                      const article = await Connection("articles")
                        .select("articles.*", "tags.name as tag_name", "categoryArticles.name as category_name")
                        .where({ slug: key.toLowerCase() })
                        .leftJoin("articleTag", "articles.id", "articleTag.article_id")
                        .leftJoin("tags", "articleTag.tag_id", "tags.id")
                        .leftJoin("categoryArticle", "articles.id", "categoryArticle.article_id")
                        .leftJoin("categoryArticles", "categoryArticle.category_id", "categoryArticles.id");
                      
                      article.forEach((row) => {

                        if (!articleWithTags.id) {
                          articleWithTags.id = row.id;
                          articleWithTags.title = row.title;
                          articleWithTags.author = row.author;
                          articleWithTags.content = row.content;
                          articleWithTags.author_id = row.author_id;
                          articleWithTags.slug = row.slug;
                          articleWithTags.createdAt = row.createdAt;
                          articleWithTags.updatedAt = row.updatedAt;
                        }
                        
                        if (row.tag_name) {
                    
                          if(!articleWithTags.tags.includes(row.tag_name))
                                {
                                    articleWithTags.tags.push(row.tag_name)
                                }
                        }
                        if(row.category_name){
                            if(!articleWithTags.categories.includes(row.category_name))
                                {
                                    articleWithTags.categories.push(row.category_name)
                                }
                        }
                      });
                      
                    
                    res.status(200).send(articleWithTags);
                }
                else {
                    res.sendStatus(404);
                }
            }
            else {
                const exists: boolean = await this.verifyArticleById(Number(key));

                if (exists) {
                    const article: boolean = await Connection("articles").select("*").where({ id: key }).first();

                    res.status(200).send(article);
                }
                else {
                    res.sendStatus(404);
                }
            }

        }
        catch (error: any) {
            res.sendStatus(400);
        }
    }

    public async getArticlesByCategory(req:Request, res:Response){
            try{
                const category:string  = req.params.category;
            if(category === ''){
                throw new Error("Invalid category!");
            }
            const articlesWithGivenCategory:IArticleWithCategory[] = await Connection("articles").select("articles.*",  "categoryArticles.name as categories")
            .leftJoin("categoryArticle", "article_id", "articles.id")
            .leftJoin("categoryArticles", "categoryArticle.category_id", "categoryArticles.id")
            .where({"name": slugify(category)});
            

            res.status(200).send(articlesWithGivenCategory);
            }
            catch(error:any){
                res.status(400).send(error.message);
            }
    }

    public updateArticle = async (req: Request, res: Response) => {

        try {
            const id: number = Number(req.params.id);
            const article: Partial<IArticle> = req.body;
            const exists: boolean = await this.verifyArticleById(id);

            const updatedArticle: object = {
                ...article,
                updatedAt: this.currentDate
            }
            if (!exists) {
                return res.status(404).send("The articles Doesn't exists");
            }

            await Connection("articles").update(updatedArticle).where({ id });

            return res.sendStatus(200);
        }
        catch (error: any) {
            return res.sendStatus(400);
        }

    }
}


export default Article;