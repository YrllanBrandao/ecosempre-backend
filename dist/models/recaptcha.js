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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = __importDefault(require("axios"));
class Recaptcha {
    constructor() {
        this.verify_url = 'https://www.google.com/recaptcha/api/siteverify';
    }
    compareResponses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { recaptchaToken } = req.body;
                const data = {
                    secret: process.env.RECAPTCHA_SERVER_SECRET,
                    response: recaptchaToken
                };
                const response = yield axios_1.default.post(this.verify_url, data);
                res.status(200).json(response.data);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
}
exports.default = Recaptcha;
