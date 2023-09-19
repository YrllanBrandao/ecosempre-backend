import { Request, Response } from 'express';
import slugify from 'slugify';
import Connection from '../database/connection';
import Static from '../static';


interface ITag{
    id?:number
    name: string;
    createdAt?: string,
    updatedAt?: string
}



class Tag{
    constructor(){};
    private currentDate:string  = new Static().getCurrentDate();
    private async verifyTagByName (name:string)
    {
        const tag:object | undefined = await Connection("tags").select("*").where({name: slugify(name)}).first();
        if(tag === undefined )
        {
            return false;
        }
        return true;
    }
    private async verifyTagById (id:number)
    {
        const tag:object | undefined = await Connection("tags").select("*").where({id}).first();

        if(tag === undefined )
        {
            return false;
        }
        return true;
    }
   public async createTag (req:Request, res:Response){
    try{
        const {name}:{name:string} = req.body;

        const fullTag:ITag = {
            name:slugify(name),
            createdAt: this.currentDate,
            updatedAt: this.currentDate
        }
    const exists:boolean = await this.verifyTagByName(name);

    if(!exists)
    {
        const tagId:number = await Connection("tags").insert(fullTag);

        res.status(201).send(tagId);
    }
    else{
        res.sendStatus(409);
    }
    }
    catch(error:any)
    {
        res.sendStatus(400);
    }
    }

    public async deleteTag(req:Request, res:Response){
        try{
            const {id}:{id:string} = req.body;
            const idParsed:number = Number(id)
            if(idParsed <= 0)
            {
                throw new Error("invalid id");
            }
            const exist:boolean = await this.verifyTagById(idParsed);

            if(exist)
            {
                await Connection("articleTag").delete("*").where({tag_id:idParsed});
                await Connection("tags").delete("*").where({id: idParsed});
                res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }
        }
        catch(error:any)
        {
            res.status(400).send(error.message);
        }
    }
    public async updateTag(req:Request, res:Response){
        try{
       
            const tag:ITag = req.body
            const id:number = Number(tag.id);
            if(id <= 0)
            {
                throw new Error("invalid id");
            }
            tag.name = slugify(tag.name);
            const exist:boolean = await this.verifyTagById(id);
            const nameConflict:boolean = await this.verifyTagByName(tag.name);
           
           if(exist)
            {
                if(nameConflict){
                    res.status(409).send(`The tag "${tag.name} already exists`);
                }
               else{
                await Connection("tags").update(tag).where({id});
                res.sendStatus(200);
               }
            }else{
                res.sendStatus(404);
            }
        }
        catch(error:any)
        {
            res.sendStatus(400);
        }
    }
    public async getTags(req:Request, res:Response){
        try{
            const tags:string[] = await Connection("tags").select("*");

        if(tags[0] === undefined)
        {
            res.sendStatus(404);
        }
        else{
            res.status(200).send(tags)
        }
        }
        catch(error:any)
        {
            res.sendStatus(400);
        }
    }

}

export default Tag;