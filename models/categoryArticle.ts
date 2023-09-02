import { Request, Response } from 'express';
import Connection from '../database/connection';
import Static from '../static';

interface ICategoryArticles{
    name: string;
    createdAt ?: string;
    updatedAt ?: string;
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
            const incompleteCategory: ICategoryArticles = req.body;
            const category:ICategoryArticles = {
                ...incompleteCategory,
                createdAt: this.currentDate,
                updatedAt: this.currentDate
            }
            const exist:boolean = await this.verifyCategoryExistence(incompleteCategory.name);

            if(!exist){
                const categoryId: number = await Connection('categoryArticles');

            }else{
                res.sendStatus(409);
            }
        }
        catch(error: any){
            res.sendStatus(400);
        }

    }
}