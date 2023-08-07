import knex, {Knex, } from 'knex';
import dotenv from 'dotenv';
dotenv.config();
const host:string = process.env.DB_HOST!;
const port:number = Number(process.env.DB_PORT!);
const user:string = process.env.DB_USER!;
const database:string = process.env.DB_NAME!;
const knexConfig: Knex.Config = {
    client: "mysql2",
    connection:{
        host,
        port,
        user,
        password: process.env.DB_PASSWORD,
        database
    }
}

const Connection:Knex = knex(knexConfig);


export default Connection;