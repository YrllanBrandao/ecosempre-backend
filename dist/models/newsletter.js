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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = __importDefault(require("../database/connection"));
const static_1 = __importDefault(require("../static"));
class Newsletter {
    constructor() {
        this.currentDate = new static_1.default().getCurrentDate();
    }
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, connection_1.default)("newsletter").select("*").where({ email }).first();
            if (query === undefined) {
                return false;
            }
            return true;
        });
    }
    validateEmail(email) {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (pattern.test(email)) {
            return true;
        }
        return false;
    }
    descryptJwtToken(token) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            return decodedToken;
        }
        catch (error) {
            return null;
        }
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = yield (0, connection_1.default)("newsletter").select("*");
                if (query[0] === undefined || query === null) {
                    return res.sendStatus(404);
                }
                else {
                    res.status(200).send(query);
                }
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
    }
    registerEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const isValid = this.validateEmail(email);
                if (isValid) {
                    const exist = yield this.verifyEmail(email);
                    if (exist) {
                        return res.status(409).send("The e-mail already is registered!!!");
                    }
                    else {
                        yield (0, connection_1.default)("newsletter").insert({
                            email,
                            createdAt: this.currentDate,
                            updatedAt: this.currentDate
                        });
                        res.sendStatus(201);
                    }
                }
                else {
                    res.sendStatus(400);
                }
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
    }
    deleteEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const isValid = this.validateEmail(email);
                const exist = yield this.verifyEmail(email);
                if (isValid) {
                    if (exist) {
                        yield (0, connection_1.default)("newsletter").delete("*").where({ email });
                        res.sendStatus(200);
                    }
                    else {
                        res.sendStatus(404);
                    }
                }
                else {
                    throw new Error("invalid E-mail");
                }
            }
            catch (error) {
                res.sendStatus(400);
            }
        });
    }
    deleteEmailFromNewsletter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.query;
                if (token === undefined || token === null) {
                    throw new Error("Invalid token");
                }
                const decodedToken = this.descryptJwtToken(token);
                if (decodedToken) {
                    const isValid = this.validateEmail(decodedToken.email);
                    const exist = yield this.verifyEmail(decodedToken.email);
                    if (isValid) {
                        if (exist) {
                            yield (0, connection_1.default)("newsletter").delete("*").where({ email: decodedToken.email });
                            res.sendStatus(200);
                        }
                        else {
                            res.sendStatus(404);
                        }
                    }
                    else {
                        throw new Error("invalid E-mail");
                    }
                }
                else {
                    throw new Error("Invalid token");
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
}
exports.default = Newsletter;
