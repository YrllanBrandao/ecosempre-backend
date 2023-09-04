"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const static_1 = __importDefault(require("../static"));
class CategoryArticle {
    constructor() {
        this.currentDate = new static_1.default().getCurrentDate();
    }
    verifyCategoryExistence(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield (0, connection_1.default)('categoryArticles').select("*").where({ name }).first();
            if (category === undefined) {
                return false;
            }
            return true;
        });
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const category = {
                    name,
                    createdAt: this.currentDate,
                    updatedAt: this.currentDate
                };
                const lowedName = category.name.toLowerCase();
                category.name = lowedName;
                const exist = yield this.verifyCategoryExistence(lowedName);
                if (!exist) {
                    yield (0, connection_1.default)('categoryArticles').insert(category);
                    res.sendStatus(201);
                }
                else {
                    res.sendStatus(409);
                }
            }
            catch (error) {
                res.status(400).send(error.sqlMessage);
            }
        });
    }
}
exports.default = CategoryArticle;
