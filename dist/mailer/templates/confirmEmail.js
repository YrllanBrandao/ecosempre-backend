"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function confirmEmail(url) {
    // Main content
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de E-mail</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1f6848;">Confirmação de E-mail</h1>
            <p style="color: #4d4d4d;">Obrigado por se cadastrar! Para confirmar o seu e-mail, clique no botão abaixo:</p>
            <a href="#" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #2ba84a; color: #ffffff; text-decoration: none; border-radius: 5px;">Confirmar E-mail</a>
        </div>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: left; font-size: 14px; color: #999;">
            <p>Eco Sempre</p>
            <p>Endereço: Rua das Flores, 123 - Cidade - Estado</p>
            <p>Telefone: (00) 1234-5678</p>
            <p>E-mail: contato@empresaexemplo.com</p>
        </div>
    </body>
    </html>
    
    `;
}
exports.default = confirmEmail;
