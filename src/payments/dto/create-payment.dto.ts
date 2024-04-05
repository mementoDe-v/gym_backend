import {  IsEnum, IsPositive,} from "class-validator";
import { PaymentMethods } from "./payment-methods.dto";
import { IsDecimal } from "src/common/validators/is-decimal.validator";
import { ApiProperty } from "@nestjs/swagger";



export class CreatePaymentDto {

    @ApiProperty({ example: 46.65 })
    @IsDecimal()
    @IsPositive()
    amount: number;

    @ApiProperty({ 
        enum: PaymentMethods,
        example: 'debit card' })
    @IsEnum( PaymentMethods )
    method: PaymentMethods;

}
