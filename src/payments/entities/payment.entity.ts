import { Client } from "src/clients/entities/client.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethods } from "../dto/payment-methods.dto";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Payment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column( 'numeric', {
        scale: 2,
        nullable: false,
    } )
    amount: number;

    @ApiProperty()
    @Column( 'enum', {
        enum: PaymentMethods
    })
    method: string;

    @ApiProperty()
    @Column( 'date' )
    date: string;

    @ManyToOne( 
        () => Client,
        ( client ) => client.payment,
        { eager: true }
    )
    client: Client

}
