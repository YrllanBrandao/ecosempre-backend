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
const connection_1 = __importDefault(require("../database/connection"));
const static_1 = __importDefault(require("../static"));
class Tag {
    constructor() {
        this.currentDate = new static_1.default().getCurrentDate();
    }
    ;
    verifyTagByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield (0, connection_1.default)("tags").select("*").where({ name: (0, slugify_1.default)(name) }).first();
            if (tag === undefined) {
                return false;
            }
            return true;
        });
    }
    verifyTagById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield (0, connection_1.default)("tags").select("*").where({ id }).first();
            if (tag === undefined) {
                return false;
            }
            return true;
        });
    }
    hasRelashionship(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const relashionship = yield (0, connection_1.default)("articleTag").select("*").where({ tag_id: id }).first();
            if (relashionship === undefined) {
                return false;
            }
            return true;
        });
    }
    createTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const fullTag = {
                    name: (0, slugify_1.default)(name),
                    createdAt: this.currentDate,
                    updatedAt: this.currentDate
                };
                const exists = yield this.verifyTagByName(name);
                if (!exists) {
                    const tagId = yield (0, connection_1.default)("tags").insert(fullTag);
                    res.status(201).send(tagId);
                }
                else {
                    res.sendStatus(409);
                }
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
    }
    deleteTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const idParsed = Number(id);
                if (idParsed <= 0) {
                    throw new Error("invalid id");
                }
                const exist = yield this.verifyTagById(idParsed);
                const hasRelashionship = yield this.hasRelashionship(idParsed);
                if (hasRelashionship) {
                    res.status(422).send("Unable to delete this tag, it belongs to an existing article");
                    return;
                }
                if (exist) {
                    yield (0, connection_1.default)("articleTag").delete("*").where({ tag_id: idParsed });
                    yield (0, connection_1.default)("tags").delete("*").where({ id: idParsed });
                    res.sendStatus(200);
                }
                else {
                    res.sendStatus(404);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    updateTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = req.body;
                const id = Number(tag.id);
                if (id <= 0) {
                    throw new Error("invalid id");
                }
                tag.name = (0, slugify_1.default)(tag.name);
                const exist = yield this.verifyTagById(id);
                const nameConflict = yield this.verifyTagByName(tag.name);
                if (exist) {
                    if (nameConflict) {
                        res.status(409).send(`The tag "${tag.name} already exists`);
                    }
                    else {
                        yield (0, connection_1.default)("tags").update(tag).where({ id });
                        res.sendStatus(200);
                    }
                }
                else {
                    res.sendStatus(404);
                }
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
    }
    getTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield (0, connection_1.default)("tags").select("*");
                if (tags[0] === undefined) {
                    res.sendStatus(404);
                }
                else {
                    res.status(200).send(tags);
                }
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
    }
}
exports.default = Tag;
