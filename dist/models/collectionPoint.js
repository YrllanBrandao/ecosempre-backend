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
    checkCollectionPointsExistence(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof key === 'string') {
                const query = yield (0, connection_1.default)("collectionPoints").select("*").where({ cep: key }).first();
                if (query === undefined) {
                    return false;
                }
            }
            if (typeof key === 'number') {
                const query = yield (0, connection_1.default)("collectionPoints").select("*").where({ id: key }).first();
                if (query === undefined) {
                    return false;
                }
            }
            return true;
        });
    }
    checkCategorysExistence(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, connection_1.default)("categoriesCollectionPoints").select("*").where({ id: category_id }).first();
            if (query === undefined) {
                return false;
            }
            return true;
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionPoints = yield (0, connection_1.default)("collectionPoints")
                    .select("collectionPoints.*", "categoriesCollectionPoints.name as category_name")
                    .innerJoin("categoriesCollectionPoints", "categoriesCollectionPoints.id", "collectionPoints.category_id");
                const collectionPointList = [];
                const collectionPointsObtaineds = new Set;
                if (collectionPoints[0] === undefined) {
                    res.sendStatus(404);
                }
                else {
                    collectionPoints.forEach(collectionPoint => {
                        const fullCollectionPoint = {
                            id: collectionPoint.id,
                            name: collectionPoint.name,
                            address: collectionPoint.address,
                            cep: collectionPoint.cep,
                            city: collectionPoint.city,
                            state: collectionPoint.state,
                            size: collectionPoint.size,
                            category: {},
                            createdAt: collectionPoint.createdAt,
                            updatedAt: collectionPoint.updatedAt
                        };
                        if (!collectionPointsObtaineds.has(Number(collectionPoint.id))) {
                            const category = {
                                id: collectionPoint.category_id,
                                name: collectionPoint.category_name
                            };
                            fullCollectionPoint.category = category;
                            collectionPointsObtaineds.add(collectionPoint.id);
                            collectionPointList.push(fullCollectionPoint);
                        }
                    });
                    res.status(200).send(collectionPointList);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
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
                    if (collectionPoint.category_id) {
                        const categoryExist = yield this.checkCategorysExistence(Number(collectionPoint.category_id));
                        if (categoryExist) {
                            const collectionPointId = yield (0, connection_1.default)("collectionPoints").insert(collectionPoint);
                            res.status(201).send(collectionPointId);
                        }
                        else {
                            throw new Error("the category doesn't exist");
                        }
                    }
                    else {
                        yield (0, connection_1.default)("collectionPoints").insert(collectionPoint);
                        res.sendStatus(201);
                    }
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    deleteCollectionPoint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const exists = yield this.checkCollectionPointsExistence(Number(id));
                if (!exists) {
                    throw new Error("The Collection doesn't exists");
                }
                yield (0, connection_1.default)("collectionPoints").delete("*").where({ id });
                res.sendStatus(200);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    updateCollectionPoint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionPoint = req.body;
                collectionPoint.updatedAt = this.currentDate;
                const exists = yield this.checkCollectionPointsExistence(Number(collectionPoint.id));
                if (exists) {
                    yield (0, connection_1.default)("collectionPoints").update(collectionPoint).where({ id: collectionPoint.id });
                    res.sendStatus(200);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
}
exports.default = CollectionPoint;
