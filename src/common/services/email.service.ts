import { Injectable } from '@nestjs/common';
import { SendEmail } from '../dto/sendEmail.dto';
const Nylas = require('nylas');
import Draft from 'nylas/lib/models/draft';
import { ConfigService } from '@nestjs/config';

/**
 * Servicio para enviar correos electrónicos utilizando Nylas.
 */
@Injectable()
export class EmailService implements SendEmail {
    /**
     * Constructor del servicio de correo electrónico.
     * Configura Nylas con las credenciales de cliente.
     * @param configService Servicio para acceder a las variables de configuración.
     */
    constructor(private configService: ConfigService) {
        Nylas.config({
            clientId: this.configService.get('CLIENT_ID'),
            clientSecret: this.configService.get('CLIENT_SECRET'),
        });
    }

    /**
     * Envia un correo electrónico utilizando Nylas.
     * @param to Dirección de correo electrónico del destinatario.
     * @param subject Asunto del correo electrónico.
     * @param body Cuerpo del correo electrónico.
     * @returns Promesa que se resuelve con el mensaje 'Email sent' si el correo se envía exitosamente.
     * @throws Error si ocurre un problema al enviar el correo electrónico.
     */
    async sendEmail(to: string, subject: string, body: string): Promise<string> {
        const nylas = Nylas.with(this.configService.get('NYLAS_JWT'));

        const draft = new Draft(nylas, {
            subject,
            body,
            to: [{ email: to }],
        });

        try {
            await draft.send();
            return 'Email sent';
        } catch (error) {
            console.log(error);
            throw new Error('Error');
        }
    }
}
