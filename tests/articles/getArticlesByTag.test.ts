import {it,  afterAll, beforeAll, expect, describe} from '@jest/globals';
import supertest, {Response} from 'supertest';

import app from '../../server';


describe("Testing the endpoint /articles/[tagname]]", ()=>{

    beforeAll(()=>{
        process.env.NODE_ENV= "test";
    })  

    it("should return an Array", async ()=>{
        const res:Response = await supertest(app).get("/api/v1/articles/ecologia");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    })

    afterAll(()=>{
        process.env.NODE_ENV = "development"
    })
})