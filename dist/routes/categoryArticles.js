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
const express_1 = __importDefault(require("express"));
const categoryArticle_1 = __importDefault(require("../models/categoryArticle"));
const middleware_1 = __importDefault(require("../auth/middleware"));
const categoryArticlesRoutes = express_1.default.Router();
const middleware = new middleware_1.default();
categoryArticlesRoutes.post("/category-article", middleware.handle, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryArticle = new categoryArticle_1.default();
    categoryArticle.createCategory(req, res);
}));
categoryArticlesRoutes.get("/category-article", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryArticle = new categoryArticle_1.default();
    categoryArticle.getCategories(req, res);
}));
exports.default = categoryArticlesRoutes;
