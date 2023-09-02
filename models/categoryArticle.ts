import { Request, Response } from 'express';
import Connection from '../database/connection';
import Static from '../static';

interface ICategoryArticle{
    name: string;
    createdAt ?: string;
    updatedAt ?: string;
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
            const exist:boolean = await this.verifyCategoryExistence(incompleteCategory.name);

            if(!exist){
                await Connection('categoryArticles');
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