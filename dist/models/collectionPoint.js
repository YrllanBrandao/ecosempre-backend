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
class CollectionPoint {
    constructor() {
        this.currentDate = new static_1.default().getCurrentDate();
    }
    checkCollectionPointsExistence(cep) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, connection_1.default)("collectionPoints").select("*").where({ cep }).first();
            if (query === undefined) {
                return false;
            }
            return true;
        });
    }
    checkCategorysExistence(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, connection_1.default)("categoryCollectionPoints").select("*").where({ id: category_id }).first();
            if (query === undefined) {
                return false;
            }
            return true;
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionPoints = yield (0, connection_1.default)("collectionPoints").select("*");
                if (collectionPoints[0] === undefined) {
                    res.sendStatus(404);
                }
                else {
                    res.status(200).send(collectionPoints);
                }
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
    }
    createCollectionPoint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionPointIncomplete = req.body;
                const collectionPoint = Object.assign(Object.assign({}, collectionPointIncomplete), { createdAt: this.currentDate, updatedAt: this.currentDate });
                const alreadyExist = yield this.checkCollectionPointsExistence(collectionPoint.cep);
                if (alreadyExist) {
                    res.sendStatus(409);
                }
                else {
                    const categoryExist = yield this.checkCategorysExistence(Number(collectionPoint.category_id));
                    if (categoryExist) {
                        yield (0, connection_1.default)("collectionPoints").insert(collectionPoint);
                        res.sendStatus(201);
                    }
                    else {
                        throw new Error("the category doesn't exist");
                    }
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
}
exports.default = CollectionPoint;
