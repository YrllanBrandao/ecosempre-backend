import { Request, Response } from 'express';

import Connection from '../database/connection';
import Static from '../static';
import { IArticle } from './article';
import slugify from 'slugify';

interface ICategoryArticle{
    id?: number;
    name: string;
    createdAt ?: string;
    updatedAt ?: string;
}
interface ICategoryArticleUpdate{
    id: number;
    name: string;
}


class CategoryArticles{
    private  currentDate = new Static().getCurrentDate();

    private async verifyCategoryExistence(name:string){ 
        const category : object | undefined = await Connection('categoryArticles').select("*").where({name: slugify(name)}).first();
        if(category === undefined){
            return false;
        }
        return true;
    }
    private async verifyCategoryExistenceById(id:number){ 
        const category : object | undefined = await Connection('categoryArticles').select("*").where({id}).first();
        if(category === undefined){
            return false;
        }
        return true;
    }
    private  async  hasRelashionship(id: number){
        const relashionship:object | undefined = await Connection("categoryArticle").select("*").where({category_id:id}).first();

        if(relashionship === undefined )
        {
            return false;
        }
        return true;
    }
    public async createCategory(req: Request, res:Response){
        try{
            const {name}:{name:string}= req.body;
            const category:ICategoryArticle = {
                name: slugify(name),
                createdAt: this.currentDate,
                updatedAt: this.currentDate
            }
            const exist:boolean = await this.verifyCategoryExistence(name);

            if(!exist){
               const categoryArticleId: number[] = await Connection('categoryArticles').insert(category);
                res.status(201).json({
                    id: categoryArticleId[0]
                });
            }else{
                res.sendStatus(409);
            }
        }
        catch(error: any){
            res.status(400).send(error.sqlMessage);
        }

    }

    public async getCategories(req:Request, res:Response){
        try{
            const categories:ICategoryArticle[] = await Connection("categoryArticles").select("*").orderBy("id", "desc");

            if(categories[0] !== undefined){
                res.status(200).send(categories);
            }
            else{
                res.sendStatus(404);
            }
        }
        catch(error:any){
        res.sendStatus(500);
        }
    }
    public async update(req:Request, res:Response){
        try{
            const categoryOfArticle:ICategoryArticleUpdate = req.body;

            const exists:boolean = await this.verifyCategoryExistenceById(Number(categoryOfArticle.id));

            if(!exists){
                res.sendStatus(404);
            }
            else{
                await Connection("categoryArticles").update(categoryOfArticle).where({id:categoryOfArticle.id})
            res.sendStatus(200);
            }
            
        }
        catch(error:any){
            res.status(400).send(error.message);
        }
    }
    
    public async delete(req:Request, res:Response){
        try{
            const {id}:{id:string} = req.body;

            const exists:boolean = await this.verifyCategoryExistenceById(Number(id));
            const hasRelashionship: boolean = await this.hasRelashionship(Number(id));

            if(hasRelashionship){
                res.status(422).send("Unable to delete this category, it belongs to an existing article");
                return;
            }
            if(!exists){
                res.sendStatus(404);
            }
            else{
                await Connection("categoryArticle").delete("*").where({article_id: Number(id)});
            await Connection("categoryArticles").delete("*").where({id: Number(id)});
            res.sendStatus(200);
            }
            
        }
        catch(error:any){
            res.status(400).send(error.message);
        }
    }

}
export default CategoryArticles;