import { ApiProperty } from "@nestjs/swagger";
import { Client } from "src/clients/entities/client.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @ApiProperty()
    @Column( 'text', {
        unique: true,
        nullable: false,
    } )
    email: string;

    @ApiProperty()
    @Column( 'text',{
        nullable: false,
    } )
    fullName: string;

    @ApiProperty()
    @Column( 'text', {
        nullable: false,
        select: false,
    } )
    password: string;

    @ApiProperty()
    @Column( 'bool', {
        nullable: false,
        default: true,
    } )
    isActive: boolean;

    @ApiProperty()
    @Column( 'text' , {
        array: true,
        default: ['user'],
    })
    roles: string[]

    @ApiProperty()
    @Column('bool', {
        default: false,
    })
    isVerified: boolean;

    @ApiProperty()
    @Column('text', {
        default: null,
        select: false,
    })
    emailToken: string;

    @ApiProperty()
    @Column( 'timestamp', {
        nullable: true,
    } )
    tokenDateExp: Date;

    @ApiProperty()
    @Column( 'text', {
        unique: true,
        nullable: true,
    } )
    tempEmail: string;

    @ApiProperty()
    @Column( 'text', {
        unique: true,
        nullable: true,
    } )
    tempPassword: string;

    @ApiProperty()
    @Column( 'timestamp', {
        nullable: true,
    } )
    tempPasswordExp: Date;

    @OneToMany(
        () => Client,        
        ( client ) => client.user
    )
    client: Client;

    @BeforeInsert()

    checkFieldFormat () {

        this.email = this.email.toLowerCase().trim();

    }

    @BeforeUpdate()
    checkFieldFormatUpdate () {

        this.email = this.email.toLowerCase().trim();

    }

}
