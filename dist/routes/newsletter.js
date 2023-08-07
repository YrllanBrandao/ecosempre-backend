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
const newsletter_1 = __importDefault(require("../models/newsletter"));
const middleware_1 = __importDefault(require("../auth/middleware"));
const newsletterRoutes = express_1.default.Router();
const middleware = new middleware_1.default();
newsletterRoutes.post("/newsletter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsletter = new newsletter_1.default();
    newsletter.registerEmail(req, res);
}));
newsletterRoutes.delete("/newsletter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsletter = new newsletter_1.default();
    newsletter.deleteEmail(req, res);
}));
newsletterRoutes.get("/newsletter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsletter = new newsletter_1.default();
    newsletter.getAll(req, res);
}));
newsletterRoutes.get("/unsubscribe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsletter = new newsletter_1.default();
    newsletter.deleteEmail(req, res);
}));
exports.default = newsletterRoutes;
