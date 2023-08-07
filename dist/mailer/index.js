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
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const connection_1 = __importDefault(require("../database/connection"));
class Mailer {
    constructor() { }
    generateCancelToken(email) {
        const payload = {
            email: email
        };
        const secretKey = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign(payload, secretKey);
        return token;
    }
    removeTemporaryAttachments(filePaths) {
        filePaths.forEach((attachment) => {
            const filePath = attachment.path;
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${filePath}: ${err.message}`);
                }
                else {
                    console.log(`File ${filePath} deleted successfully.`);
                }
            });
        });
    }
    sendMail(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = {
                    host: "smtp.office365.com",
                    port: 587,
                    auth: {
                        user: process.env.PUSH_EMAIL,
                        pass: process.env.PUSH_EMAIL_PASS
                    }
                };
                const SUCCESS_CODE = 200;
                const transporter = nodemailer_1.default.createTransport(config);
                return new Promise((resolve, reject) => {
                    transporter.sendMail(message, (error, info) => {
                        if (error) {
                            reject(new Error(`ERROR: ${error}`));
                        }
                        else {
                            resolve(SUCCESS_CODE);
                        }
                    });
                });
            }
            catch (error) {
                const ERROR_CODE = 500;
                return ERROR_CODE;
            }
        });
    }
    sendBatchEmails(info) {
        return __awaiter(this, void 0, void 0, function* () {
            const NewsletterEmails = yield (0, connection_1.default)("newsletter").select("*");
            const emails = NewsletterEmails.map((register) => register.email);
            for (const email of emails) {
                const cancelToken = this.generateCancelToken(email);
                const cancelLink = `${process.env.ECOSEMPRE_DOMAIN}/unsubscribe?token=${cancelToken}`;
                const pushMessage = {
                    from: process.env.PUSH_EMAIL,
                    to: email,
                    subject: "Nova publicação no blog da Eco Sempre",
                    html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Nova Publicação - Newsletter</title>
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #ffffff;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                      <h1 style="color: #1f6848;">Nova Publicação no blog da Eco Sempre</h1>
                      <p style="color: #4d4d4d;">Estamos felizes em compartilhar a postagem mais recente. Confira os detalhes abaixo:</p>
                      <h2 style="color: #1f6848;">${info.title}</h2>
                      <p style="color: #4d4d4d;">Clique no botão abaixo para ler o artigo completo:</p>
                      <a href="${process.env.ECOSEMPRE_DOMAIN}/${info.slug}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #2ba84a; color: #ffffff; text-decoration: none; border-radius: 5px;">Leia Mais</a>
                  </div>
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: left; font-size: 14px; color: #999;">
                      <p>Empresa Exemplo LTDA.</p>
                      <p>Endereço: Rua das Flores, 123 - Cidade - Estado</p>
                      <p>Telefone: (00) 1234-5678</p>
                      <p>E-mail: contato@empresaexemplo.com</p>
                      <p style="margin-top: 20px;">Você está recebendo este e-mail porque se inscreveu em nossa newsletter. Se desejar não receber mais atualizações, clique no link abaixo:</p>
                      <a href="${cancelLink}" target="_blank" style="color: #2ba84a; text-decoration: none;">Descadastrar</a>
                  </div>
              </body>
              </html>
            `,
                };
                try {
                    yield this.sendMail(pushMessage);
                    console.log(`E-mail enviado para ${email}`);
                }
                catch (error) {
                    console.error(`Erro ao enviar e-mail para ${email}:`);
                }
            }
        });
    }
    pushSchedulePickup(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.sendMail(message);
                let attempts = 3;
                if (result === 500) {
                    attempts--;
                    if (attempts > 0) {
                        return this.pushSchedulePickup(message);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    this.removeTemporaryAttachments(message.attachments);
                    return true;
                }
            }
            catch (error) {
                this.removeTemporaryAttachments(message.attachments);
                return false;
            }
        });
    }
    confirmEmail(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.sendMail(message);
                let attempts = 3;
                if (result === 500) {
                    attempts--;
                    if (attempts > 0) {
                        return this.confirmEmail(message);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.default = Mailer;
