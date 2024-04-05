import { Injectable } from '@nestjs/common';
import { SendEmail } from '../dto/sendEmail.dto';
const Nylas = require('nylas');
import Draft from 'nylas/lib/models/draft'
import { ConfigService } from '@nestjs/config';


@Injectable()
export class EmailService implements SendEmail {

    constructor( 
        private configService: ConfigService,
) {
        Nylas.config( {
            clientId: this.configService.get('CLIENT_ID'),
            clientSecret: this.configService.get('CLIENT_SECRET'),
        } );
    }

    async sendEmail( to: string, subject: string, body: string ): Promise<string> {
        

        const nylas = Nylas.with( this.configService.get('NYLAS_JWT') );

        const draft = new Draft(nylas, {
            subject,
            body,
            to: [{email: to}]
        } );

        try {

            await draft.send();
            return 'Email sent';
            
        } catch (error) {
            console.log( error );
            throw new Error( "Error al enviar el correo" );
        }   


    }
}
