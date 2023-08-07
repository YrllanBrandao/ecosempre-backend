import nodemailer, {Transporter} from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config();

import SchedulePickup, { ScheduleMessage, Attachment } from '../models/schedulePickUp';
import Connection from '../database/connection';

interface IConfig{
    host: string
    port: number,
    auth: {
        user: string,
        pass: string
    }
}

export interface IEmailMessage{
    from: string,
    to: string[] | string,
    subject: string,
    html: string,
}

interface NewsletterEmail {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
  }

interface PushNewsletter{
    slug: string;
    title: string;
}



class Mailer{
    constructor(){}

    private generateCancelToken(email: string): string {
        const payload = {
          email: email
        };
    
        const secretKey = process.env.JWT_SECRET!;

        const token = jwt.sign(payload, secretKey);
        return token;
      }

    private removeTemporaryAttachments(filePaths: Attachment[]) {
        filePaths.forEach((attachment) => {
          const filePath = attachment.path;
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}: ${err.message}`);
            } else {
              console.log(`File ${filePath} deleted successfully.`);
            }
          });
        });
      }
      
    private async sendMail(message: IEmailMessage): Promise<number> {
        try {
            const config: IConfig = {
                host: "smtp.office365.com",
                port: 587,
                auth: {
                    user: process.env.PUSH_EMAIL!,
                    pass: process.env.PUSH_EMAIL_PASS!
                }
            };
            const SUCCESS_CODE: number = 200;
    
            const transporter: Transporter = nodemailer.createTransport(config);
    
            return new Promise((resolve, reject) => {
                transporter.sendMail(message, (error: unknown, info: unknown) => {
                    if (error) {
                        reject(new Error(`ERROR: ${error}`));
                    } else {
                        resolve(SUCCESS_CODE);
                    }
                });
            });
        } catch (error) {
            const ERROR_CODE: number = 500;
            return ERROR_CODE;
        }
    }
    


    public async sendBatchEmails(info: PushNewsletter) {
        const NewsletterEmails: NewsletterEmail[] = await Connection("newsletter").select("*");
        const emails: string[] = NewsletterEmails.map((register) => register.email);
    
        for (const email of emails) {
          const cancelToken = this.generateCancelToken(email);
          const cancelLink = `${process.env.ECOSEMPRE_DOMAIN!}/unsubscribe?token=${cancelToken}`;
    
          const pushMessage: IEmailMessage = {
            from: process.env.PUSH_EMAIL!,
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
                      <a href="${process.env.ECOSEMPRE_DOMAIN!}/${info.slug}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #2ba84a; color: #ffffff; text-decoration: none; border-radius: 5px;">Leia Mais</a>
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
            await this.sendMail(pushMessage);
            console.log(`E-mail enviado para ${email} \n link: ${cancelLink}`);
          } catch (error) {
            console.error(`Erro ao enviar e-mail para ${email}:`, error);
          }
        }
      }
    public async pushSchedulePickup(message: ScheduleMessage): Promise<boolean> {
        try {
            const result: number = await this.sendMail(message);
            let attempts = 3;
    
            if (result === 500) {
                attempts--;
                if (attempts > 0) {
                    return this.pushSchedulePickup(message);
                } else {
                    return false;
                }
            } else {
                this.removeTemporaryAttachments(message.attachments)
                return true;
            }
        } catch (error) {
            this.removeTemporaryAttachments(message.attachments)
            return false;
        }
    }
    public async confirmEmail(message:IEmailMessage): Promise<boolean>
    {
        try {
          
            const result: number = await this.sendMail(message);
            let attempts = 3;
    
            if (result === 500) {
                attempts--;
                if (attempts > 0) {
                    return this.confirmEmail(message);
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } catch (error) {
            return false;
        }
    }
}


export default Mailer;