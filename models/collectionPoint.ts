import { Request, Response } from "express";

import Connection from "../database/connection";
import Static from "../static";


interface ICollectionPoint{
    id?: string
    name: string,
    address: string,
    cep: string;
    category_id?: number | object,
    state: string;
    city: string;
    size: string;
    createdAt?:string;
    updatedAt?:string;
}

interface ICollectionPointObtained{
    id?: string
    name: string,
    address: string,
    cep: string;
    state: string;
    city: string;
    size: string;
    category: object;
    createdAt?:string;
    updatedAt?:string;
}

type category = {
    id: number;
    name: string;
}


class CollectionPoint{
    constructor(){}
    private currentDate:string = new Static().getCurrentDate();
    private async checkCollectionPointsExistence(key:string|number)
    {
        if(typeof key === 'string'){
            const query:object | undefined = await Connection("collectionPoints").select("*").where({cep: key}).first();

        if(query === undefined)
        {
            return false;
        }
       
        }
        if(typeof key === 'number'){
            const query:object | undefined = await Connection("collectionPoints").select("*").where({id: key}).first();

        if(query === undefined)
        {
            return false;
        }
        }
        return true;
    }
    private async checkCategorysExistence(category_id:number)
    {
        const query:object | undefined = await Connection("categoriesCollectionPoints").select("*").where({id:category_id}).first();

        if(query === undefined)
        {
            return false;
        }
        return true;
    }
    public async getAll(req:Request, res:Response){
        try{
            const collectionPoints = await Connection("collectionPoints")
            .select("collectionPoints.*", "categoriesCollectionPoints.name as category_name")
            .innerJoin("categoriesCollectionPoints", "categoriesCollectionPoints.id", "collectionPoints.category_id");


            const collectionPointList:ICollectionPointObtained[] = [];
            const collectionPointsObtaineds: Set<number> = new Set;
        if(collectionPoints[0] === undefined)
        {
            res.sendStatus(404);
        }
        else{
            
            collectionPoints.forEach(collectionPoint =>{
                const fullCollectionPoint:ICollectionPointObtained = {
                    id: collectionPoint.id,
                    name: collectionPoint.name,
                    address: collectionPoint.address,
                    cep: collectionPoint.cep,
                    city: collectionPoint.city,
                    state: collectionPoint.state,
                    size: collectionPoint.size,
                    category: {},
                    createdAt: collectionPoint.createdAt,
                    updatedAt: collectionPoint.updatedAt
                }
                if(!collectionPointsObtaineds.has(Number(collectionPoint.id)))
                {
                   const category: category = {
                    id: collectionPoint.category_id,
                    name: collectionPoint.category_name
                   }
                   fullCollectionPoint.category = category;
                   collectionPointsObtaineds.add(collectionPoint.id);
                   collectionPointList.push(fullCollectionPoint);
                }
            })
            res.status(200).send(collectionPointList);
        }
        }
        catch(error:any)
        {
            res.status(400).send(error.message);
        }
    }
    public async createCollectionPoint(req:Request,res:Response){
       try{
        const collectionPointIncomplete:ICollectionPoint = req.body;
        const collectionPoint:ICollectionPoint = {
            ...collectionPointIncomplete,
            createdAt: this.currentDate,
            updatedAt: this.currentDate
        }
        const alreadyExist:boolean = await this.checkCollectionPointsExistence(collectionPoint.cep);

        if(alreadyExist)
        {
            res.sendStatus(409);
        }
        else{
          if(collectionPoint.category_id)
          {
            const categoryExist:boolean = await this.checkCategorysExistence(Number(collectionPoint.category_id));

            if(categoryExist)
            {
                const collectionPointId:number = await Connection("collectionPoints").insert(collectionPoint);

                res.status(201).send(collectionPointId);
            }
            else{
                throw new Error("the category doesn't exist");
            }
          }
          else{

            await Connection("collectionPoints").insert(collectionPoint);

            res.sendStatus(201);
          }
        }
    
       }
       catch(error:any)
       {
        res.status(400).send(error.message);
       }
    }
    public async deleteCollectionPoint(req:Request, res:Response){
        try{
            const {id}:{id:number} = req.body;

        const exists:boolean = await this.checkCollectionPointsExistence(Number(id));
     
        if(!exists){
            throw new Error("The Collection doesn't exists");
        }
        await Connection("collectionPoints").delete("*").where({id});
            res.sendStatus(200);
        }
        catch(error:any){
            res.status(400).send(error.message);
        }

    }
    public async updateCollectionPoint(req:Request, res:Response){
        try{
            const collectionPoint:Partial<ICollectionPoint> = req.body;
            collectionPoint.updatedAt = this.currentDate;
            const exists:boolean = await this.checkCollectionPointsExistence(Number(collectionPoint.id));

            if(exists){
                await Connection("collectionPoints").update(collectionPoint).where({id: collectionPoint.id});
                res.sendStatus(200);
            }
        }
        catch(error:any){
            res.status(400).send(error.message);
        }
    }
}

export default CollectionPoint;
