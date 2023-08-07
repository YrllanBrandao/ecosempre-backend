"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT);
const user = process.env.DB_USER;
const database = process.env.DB_NAME;
const knexConfig = {
    client: "mysql2",
    connection: {
        host,
        port,
        user,
        password: process.env.DB_PASSWORD,
        database
    }
};
const Connection = (0, knex_1.default)(knexConfig);
exports.default = Connection;
