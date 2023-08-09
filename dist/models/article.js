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
const slugify_1 = __importDefault(require("slugify"));
const static_1 = __importDefault(require("../static"));
const connection_1 = __importDefault(require("../database/connection"));
const mailer_1 = __importDefault(require("../mailer"));
class Article {
    constructor() {
        this.currentDate = new static_1.default().getCurrentDate();
        this.verifyArticleByTitle = (title) => __awaiter(this, void 0, void 0, function* () {
            const exist = yield (0, connection_1.default)("articles").select("*").where({ title });
            if (exist[0] !== undefined) {
                return true;
            }
            return false;
        });
        this.verifyArticleBySlug = (slug) => __awaiter(this, void 0, void 0, function* () {
            const exist = yield (0, connection_1.default)("articles").select("*").where({ slug });
            if (exist[0] !== undefined) {
                return true;
            }
            return false;
        });
        this.verifyArticleById = (id) => __awaiter(this, void 0, void 0, function* () {
            const exist = yield (0, connection_1.default)("articles").select("*").where({ id });
            if (exist[0] !== undefined) {
                return true;
            }
            return false;
        });
        this.articleValidate = (article) => {
            const { title, author, content, author_id } = article;
            if (!title || !author || !content || !author_id) {
                return false;
            }
            return true;
        };
        this.verifyPagination = (page, limit) => {
            if (limit === undefined || page === undefined) {
                return false;
            }
            return true;
        };
        this.creatArticle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const article = req.body;
                const { tags_ids } = req.body;
                console.log(">>", tags_ids);
                const isValid = this.articleValidate(article);
                const mailer = new mailer_1.default();
                if (isValid) {
                    const exist = yield this.verifyArticleByTitle(article.title);
                    if (exist) {
                        res.status(409).send("The article already exists!");
                    }
                    else {
                        const fullArticle = {
                            title: article.title,
                            content: article.content,
                            author: article.author,
                            author_id: article.author_id,
                            createdAt: this.currentDate,
                            updatedAt: this.currentDate,
                            slug: (0, slugify_1.default)(article.title)
                        };
                        const articleId = Number(yield (0, connection_1.default)("articles").insert(fullArticle));
                        yield this.registerArticleTags(tags_ids, articleId);
                        yield mailer.sendBatchEmails({
                            slug: (0, slugify_1.default)(article.title),
                            title: article.title
                        });
                        res.status(201).send("Created Successfully!");
                    }
                }
                else {
                    throw new Error("is not valid");
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
        this.deleteArticle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const exist = yield this.verifyArticleById(id);
                if (!exist) {
                    res.status(404).send("the articles dosn't exists!");
                }
                yield (0, connection_1.default)("articles").delete("*").where({ id });
                res.status(200).send("Deleted");
            }
            catch (error) {
                res.status(400).send(error.sqlMessage);
            }
        });
        this.getArticleByKey = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = /^\d+$/g;
                const key = req.params.key;
                const result = key.match(regex);
                //is string/slug
                if (result === null) {
                    const exists = yield this.verifyArticleBySlug(key);
                    if (exists) {
                        const article = yield (0, connection_1.default)("articles").select("*").where({ slug: key }).first();
                        res.status(200).send(article);
                    }
                    else {
                        res.sendStatus(404);
                    }
                }
                else {
                    const exists = yield this.verifyArticleById(Number(key));
                    if (exists) {
                        const article = yield (0, connection_1.default)("articles").select("*").where({ id: key }).first();
                        res.status(200).send(article);
                    }
                    else {
                        res.sendStatus(404);
                    }
                }
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
        this.updateArticle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const article = req.body;
                const exists = yield this.verifyArticleById(id);
                const updatedArticle = Object.assign(Object.assign({}, article), { updatedAt: this.currentDate });
                if (!exists) {
                    return res.status(404).send("The articles Doesn't exists");
                }
                yield (0, connection_1.default)("articles").update(updatedArticle).where({ id });
                return res.sendStatus(200);
            }
            catch (error) {
                return res.sendStatus(400);
            }
        });
    }
    registerArticleTags(tags, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const tag of tags) {
                    console.log("ID?", tag);
                    const register = {
                        article_id: articleId,
                        tag_id: tag,
                        createdAt: this.currentDate,
                        updatedAt: this.currentDate
                    };
                    console.log(register);
                    yield (0, connection_1.default)("articleTag").insert(register);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyTagExistence(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, connection_1.default)("tags").select("*").where({ name: tag }).first();
            if (query === undefined) {
                return false;
            }
            return true;
        });
    }
    getArticlesByTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = req.params.tag;
                const tagExist = yield this.verifyTagExistence(tag);
                if (tagExist) {
                    const articlesWithGivenTag = yield (0, connection_1.default)("articles").select("*")
                        .innerJoin('articleTag', 'articles.id', 'articleTag.article_id')
                        .innerJoin('tags', 'articleTag.tag_id', 'tags.id')
                        .where('tags.name', tag);
                    if (articlesWithGivenTag[0] === undefined) {
                        res.sendStatus(404);
                    }
                    else {
                        res.status(200).send(articlesWithGivenTag);
                    }
                }
                else {
                    throw new Error("invalid tag");
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    getArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, page } = req.query;
                const pagination = this.verifyPagination(limit, page);
                if (pagination) {
                    const offset = (Number(page) - 1) * Number(limit);
                    const articles = yield (0, connection_1.default)("articles").select("*").limit(Number(limit)).offset(Number(offset));
                    if (articles[0] === undefined) {
                        res.status(404).send("doesn't exists articles");
                    }
                    res.status(200).send(articles);
                }
                else {
                    const articles = yield (0, connection_1.default)("articles").select("*");
                    if (articles[0] === undefined) {
                        res.sendStatus(404);
                    }
                    res.status(200).send(articles);
                }
            }
            catch (error) {
                res.status(400).send(error.sqlMessage);
            }
        });
    }
}
exports.default = Article;
