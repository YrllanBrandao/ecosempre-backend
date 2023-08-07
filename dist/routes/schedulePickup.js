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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const scheduleRoutes = express_1.default.Router();
const schedulePickUp_1 = __importDefault(require("../models/schedulePickUp"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage, limits: { files: 3 } });
scheduleRoutes.post("/schedule-pickup", upload.array("attachments", 3), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schedulePickup = new schedulePickUp_1.default();
    const files = req.files;
    if (!files || !Array.isArray(files)) {
        res.sendStatus(400);
    }
    const attachments = files.map((file) => file.filename);
    schedulePickup.createSchedule(req, res, attachments);
}));
exports.default = scheduleRoutes;
