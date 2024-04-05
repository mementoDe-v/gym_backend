export interface SendEmail {

    sendEmail (to: string , subject: string, body: string): Promise<string>
    
}