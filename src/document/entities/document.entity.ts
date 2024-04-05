import { ApiProperty } from "@nestjs/swagger";
import { Client } from "src/clients/entities/client.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Document {

    @ApiProperty( { 
        example: '04c1cd8e-8578-4bd2-8aee-c6fec1c0678e'
    } )
    @PrimaryGeneratedColumn('uuid')    
    id: string;

    @ApiProperty()
    @Column('timestamp', {
        nullable: false,
    })
    startDate: Date;

    @ApiProperty({ 
        example: "2024-04-30T20:18:45.853Z"
     })
    @Column('timestamp', {
        nullable: false,
    })
    endDate: Date;

    @ApiProperty()
    @Column('text', {
        default: "document url pending..."
    })
    url: string;

    @ApiProperty()
    @Column('boolean', {
        default: true,
    })
    status: boolean;

    @OneToOne(() => Client, {
        eager: true
    })
    @JoinColumn()
    client: Client;
}
