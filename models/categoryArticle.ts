import { Request, Response } from 'express';

import Connection from '../database/connection';
import Static from '../static';
import { IArticle } from './article';

interface ICategoryArticle{
    name: string;
    createdAt ?: string;
    updatedAt ?: string;
}
interface ICategoryWithArticle extends IArticle{
    category: number;
}
class CategoryArticles{
    private  currentDate = new Static().getCurrentDate();

    private async verifyCategoryExistence(name:string){ 
        const category : object | undefined = await Connection('categoryArticles').select("*").where({name}).first();
        if(category === undefined){
            return false;
        }
        return true;
    }
    public async createCategory(req: Request, res:Response){
        try{
            const {name}:{name:string}= req.body;
            const category:ICategoryArticle = {
                name,
                createdAt: this.currentDate,
                updatedAt: this.currentDate
            }
            const lowedName:string = category.name.toLowerCase();
            category.name = lowedName;
            const exist:boolean = await this.verifyCategoryExistence(lowedName);

            if(!exist){
                await Connection('categoryArticles').insert(category);
                res.sendStatus(201);
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

}
export default CategoryArticles;