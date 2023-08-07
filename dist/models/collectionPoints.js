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
class collectionPoint {
    constructor() {
        this.currentDate = new static_1.default().getCurrentDate();
    }
    checkCollectionPointsExistence(cep) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, connection_1.default)("collectionPoints").select("*").where({ cep });
            if (query === undefined) {
                return false;
            }
            return true;
        });
    }
    createCollectionPoints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionPoint;
        });
    }
}
exports.default = collectionPoint;
