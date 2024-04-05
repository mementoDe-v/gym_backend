import { randomBytes } from 'crypto';


export const tokenGenerator = (  ) => {

    const length: number = 8;  
    const token: string = randomBytes(length).toString('hex');

    return token;
} 