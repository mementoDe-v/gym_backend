import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Lesson } from "src/lessons/entities/lesson.entity";
import { Payment } from "src/payments/entities/payment.entity";
import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Client {

    @ApiProperty( { 
        example: '04c1cd8e-8578-4bd2-8aee-c6fec1c0678e'
    } )
    @PrimaryGeneratedColumn('uuid')    
    id: string;

    @ApiProperty()
    @Column('text', {
        nullable: false,
    })
    name: string;

    @ApiProperty()
    @Column('text', {
        nullable: false,
    })
    lastname: string;

    @ApiProperty()
    @Column('text', {
        nullable: false,
    })
    gender: string;

    @ApiProperty()
    @Column('date', {
        nullable: false,
    })
    birthday: string;

    @ApiProperty()
    @Column('text', {
        nullable: false,
        unique: true,
    })
    email: string;

    @ApiProperty()
    @Column('text', {
        nullable: false,
        unique: true,
    })
    phone: string;

    @ApiProperty( { 
        example: 1234
    } )
    @Column('numeric', {
        nullable: false,
        unique: true,
    })
    dni: number;

    @ApiProperty( { 
        example: 6
    } )
    @Column('numeric', {
        nullable: false,
    })
    plan:number;

    @ApiProperty()
    @Column('bool', {
        nullable:false,
        default: true,
    })
    planStatus: boolean;

    @ApiProperty()
    @Column('timestamp', {
        nullable: false,
    })
    startDate: Date;

    @ApiProperty( { 
        example: "2024-09-30T19:10:08.541Z"
    } )
    @Column('timestamp', {
        nullable:false,
    })
    renewalDate: Date;

    @ApiProperty({ 
        example: 6
    })
    @Column('numeric', {
        default: 0,
    })
    activeMonths: number;

    @ApiProperty( { 
        example: "5%",
        nullable: true
     } )
    @Column('text', {
        nullable: true,
    })
    discount: string;

    

    @ManyToMany(() => Lesson, lesson => lesson.client)
  lesson: Lesson[];

@ManyToOne(  
    () => User,
    ( user ) => user.client,
    { eager: true, }
)
user: User;

@OneToMany(
    () => Payment,
    (  payment ) => payment.client
)
payment: Payment

    @BeforeInsert()

    updateActiveMonthsOnInsert() {
        this.activeMonths = this.plan; // Asigna el valor inicial del plan
    }

}   
