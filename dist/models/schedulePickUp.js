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
const path_1 = __importDefault(require("path"));
const mailer_1 = __importDefault(require("../mailer"));
class SchedulePickup {
    constructor() { }
    createSchedule(req, res, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailer = new mailer_1.default();
                const scheduleData = req.body;
                const attachmentsInfo = attachments.map((filename) => ({
                    filename: path_1.default.basename(filename),
                    path: path_1.default.join('temp', filename),
                }));
                const html = `
            <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Solicitação de Agendamento de Retirada de Materiais</title>
</head>
<body>

    <p>Um novo agendamento de coleta foi feito</p>

    <p>para mais informações leia os dados abaixo e as imagens anexadas:</p>

    <ul>
        <li><strong>Nome/Nome da empresa:</strong> ${scheduleData.name}</li>
        <li><strong>E-mail:</strong> ${scheduleData.email}</li>
        <li><strong>Telefone:</strong>${scheduleData.phone}</li>
        <li><strong>CEP:</strong> ${scheduleData.cep}</li>
        <li><strong>Estado:</strong> ${scheduleData.state}</li>
        <li><strong>Cidade:</strong> ${scheduleData.city} </li>
        <li><strong>Lista de Materiais e quantidade:</strong>${scheduleData.materials}</li>
    </ul>


    <p style="font-weight: bold;">Não responda este e-mail, o mesmo foi enviado de forma automatizada</p>

</body>
</html>

            `;
                const message = {
                    from: process.env.PUSH_EMAIL,
                    to: process.env.PICKUP_TARGET_EMAIL,
                    subject: "Agendamento de Coleta",
                    html,
                    attachments: attachmentsInfo
                };
                const sended = yield mailer.pushSchedulePickup(message);
                if (sended) {
                    res.sendStatus(200);
                }
                else {
                    throw new Error('an error has ocorred');
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
}
exports.default = SchedulePickup;
