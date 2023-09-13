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
class CategoryCollectionPoints {
    constructor() {
        this.currentDate = new static_1.default().getCurrentDate();
    }
    verifyCategoryByname(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, connection_1.default)("categoriesCollectionPoints").select("*").where({ name }).first();
            if (query === undefined) {
                return false;
            }
            return true;
        });
    }
    checkExistenceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, connection_1.default)("categoriesCollectionPoints").select("*").where({ id }).first();
            if (query === undefined) {
                return false;
            }
            return true;
        });
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCategory = req.body;
                const category = Object.assign(Object.assign({}, newCategory), { createdAt: this.currentDate, updatedAt: this.currentDate });
                if (category.name === "" || category.name === undefined) {
                    throw new Error("invalid");
                }
                const alreadyExist = yield this.verifyCategoryByname(category.name);
                if (alreadyExist) {
                    res.sendStatus(409);
                }
                else {
                    yield (0, connection_1.default)("categoriesCollectionPoints").insert(category);
                    res.sendStatus(201);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield (0, connection_1.default)("categoriesCollectionPoints").select("*");
                if (categories[0] === undefined) {
                    res.sendStatus(404);
                }
                res.status(200).send(categories);
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const exists = yield this.checkExistenceById(Number(id));
                if (!exists) {
                    res.sendStatus(404);
                }
                else {
                    yield (0, connection_1.default)("collectionPoints").update({ category_id: null }).where({ category_id: id });
                    yield (0, connection_1.default)("categoriesCollectionPoints").delete("*").where({ id });
                    res.sendStatus(200);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
}
exports.default = CategoryCollectionPoints;
