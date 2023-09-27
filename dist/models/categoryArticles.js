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
const slugify_1 = __importDefault(require("slugify"));
class CategoryArticles {
    constructor() {
        this.currentDate = new static_1.default().getCurrentDate();
    }
    verifyCategoryExistence(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield (0, connection_1.default)('categoryArticles').select("*").where({ name: (0, slugify_1.default)(name) }).first();
            if (category === undefined) {
                return false;
            }
            return true;
        });
    }
    verifyCategoryExistenceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield (0, connection_1.default)('categoryArticles').select("*").where({ id }).first();
            if (category === undefined) {
                return false;
            }
            return true;
        });
    }
    hasRelashionship(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const relashionship = yield (0, connection_1.default)("categoryArticle").select("*").where({ category_id: id }).first();
            if (relashionship === undefined) {
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
                    name: (0, slugify_1.default)(name),
                    createdAt: this.currentDate,
                    updatedAt: this.currentDate
                };
                const exist = yield this.verifyCategoryExistence(name);
                if (!exist) {
                    const categoryArticleId = yield (0, connection_1.default)('categoryArticles').insert(category);
                    res.status(201).json({
                        id: categoryArticleId[0]
                    });
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
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield (0, connection_1.default)("categoryArticles").select("*").orderBy("id", "desc");
                if (categories[0] !== undefined) {
                    res.status(200).send(categories);
                }
                else {
                    res.sendStatus(404);
                }
            }
            catch (error) {
                res.sendStatus(500);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryOfArticle = req.body;
                const exists = yield this.verifyCategoryExistenceById(Number(categoryOfArticle.id));
                if (!exists) {
                    res.sendStatus(404);
                }
                else {
                    yield (0, connection_1.default)("categoryArticles").update(categoryOfArticle).where({ id: categoryOfArticle.id });
                    res.sendStatus(200);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const exists = yield this.verifyCategoryExistenceById(Number(id));
                const hasRelashionship = yield this.hasRelashionship(Number(id));
                if (hasRelashionship) {
                    res.status(422).send("Unable to delete this category, it belongs to an existing article");
                    return;
                }
                if (!exists) {
                    res.sendStatus(404);
                }
                else {
                    yield (0, connection_1.default)("categoryArticle").delete("*").where({ article_id: Number(id) });
                    yield (0, connection_1.default)("categoryArticles").delete("*").where({ id: Number(id) });
                    res.sendStatus(200);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
}
exports.default = CategoryArticles;
