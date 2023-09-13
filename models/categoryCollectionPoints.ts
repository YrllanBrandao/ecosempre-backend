import { Request, Response } from "express";

import Connection from "../database/connection";
import Static from "../static";




interface ICategoriesCollectionPoints{
    name: string,
    createdAt?: string,
    updatedAt?: string,

}

class CategoryCollectionPoints{
    constructor(){}
    private currentDate: string = new Static().getCurrentDate();

    private async verifyCategoryByname(name:string)
    {
        const query:object | undefined =  await Connection("categoriesCollectionPoints").select("*").where({name}).first();

        if(query === undefined)
        {
            return false;
        }
        return true;
    }
    private async checkExistenceById(id:number){
        const query:object | undefined =  await Connection("categoriesCollectionPoints").select("*").where({id}).first();

        if(query === undefined)
        {
            return false;
        }
        return true;
    }
    public async createCategory(req:Request, res:Response)
    {
        try{
        const newCategory:ICategoriesCollectionPoints = req.body;

        const category: ICategoriesCollectionPoints = {
            ...newCategory,
            createdAt: this.currentDate,
            updatedAt: this.currentDate
        }

        if(category.name === "" || category.name === undefined)
        {
            throw new Error("invalid")
        }
        const alreadyExist:boolean = await this.verifyCategoryByname(category.name);

        if(alreadyExist)
        {
            res.sendStatus(409);
        }
        else{
            await Connection("categoriesCollectionPoints").insert(category);

            res.sendStatus(201);
        }
        }
        catch(error:any)
        {
            res.status(400).send(error.message);
        }
    }
    public async getAll(req:Request, res:Response){
        try{
            const categories: ICategoriesCollectionPoints[] = await Connection("categoriesCollectionPoints").select("*");
            if(categories[0] === undefined){
                res.sendStatus(404);
            }
            res.status(200).send(categories);
        }
        catch(error:any){
            res.sendStatus(400);
        }

    }
    public async delete(req:Request, res:Response){
        try{
            const {id}:{id:string} = req.body;

        const exists:boolean = await this.checkExistenceById(Number(id));

        if(!exists){
            res.sendStatus(404);
        }


        await Connection("collectionPoints").update({category_id: null}).where({category_id: id});
        await Connection("categoriesCollectionPoints").delete("*").where({id});
        
        res.sendStatus(200);
        }
        catch(error:any){
            res.status(400).send(error.message);
        }
    }
}

export default CategoryCollectionPoints;