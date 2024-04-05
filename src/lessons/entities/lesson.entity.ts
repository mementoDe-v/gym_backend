import { ApiProperty } from "@nestjs/swagger";
import { Client } from "src/clients/entities/client.entity";
import { WeekDays } from "src/common/dto/week-days.dto";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Lesson {

    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @ApiProperty( )
    @Column('text', {
        nullable: false,
    })
    lesson: string;

    @ApiProperty( { example: 30 } )
    @Column('numeric',{
        default: 30,
    })
    count: number;
    
    @ApiProperty( )
    @Column('text',{
        nullable: false
    })
    lessonSchedule: string;
    
    @ApiProperty( )
    @Column( 'enum',{ 
        enum: WeekDays,
    } )
    lessonDay: WeekDays;
    
    @ApiProperty( )
    @Column( 'text',{
        nullable: false
    } )
    lessonRoom: string;

    @ApiProperty( {required: true } )
    @Column( 'text', {
        nullable: true,
    })
    lessonInstructor: string;


    @ManyToMany(() => Client, client => client.lesson)
    @JoinTable( { 
        name: 'lesson_client',
    } )
    client: Client[];



    
}
