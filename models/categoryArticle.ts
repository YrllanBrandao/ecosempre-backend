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
class CategoryArticle{
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
            const incompleteCategory: ICategoryArticle = req.body;
            const category:ICategoryArticle = {
                ...incompleteCategory,
                createdAt: this.currentDate,
                updatedAt: this.currentDate
            }
            const lowedName:string = category.name.toLowerCase();
            category.name = lowedName;
            const exist:boolean = await this.verifyCategoryExistence(lowedName);

            if(!exist){
                await Connection('categoryArticle').insert(category);
                res.sendStatus(201);
            }else{
                res.sendStatus(409);
            }
        }
        catch(error: any){
            res.sendStatus(400);
        }

    }

}
export default CategoryArticle;