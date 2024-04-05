import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { ClientsService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/client.entity';



@Injectable()
export class LessonsService {

  constructor (
    
  @InjectRepository(Lesson)
  private readonly lessonRepository: Repository<Lesson>,
  private clientService: ClientsService,
  
  ) {
    
  }

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {

    const lesson = this.lessonRepository.create(createLessonDto);

    
    const existingLessons = await this.lessonRepository
      .createQueryBuilder('lesson')
      .where('lesson.lessonDay = :lessonDay', { lessonDay: lesson.lessonDay })
      .andWhere('lesson.lessonRoom = :lessonRoom', { lessonRoom: lesson.lessonRoom })
      .getMany();

  this.checkForOverlappingLessons( lesson, existingLessons );

    try {

    await this.lessonRepository.save(lesson);
      return lesson;
      
    } catch (error) {
      
      this.handleDbExceptions( error );

    }

  }

  async findAllLessons() {

    const lessons = await this.lessonRepository.find();

    return lessons;
  }


  async findOneLesson( id: string ) {

    try {

    const lesson: Lesson = await this.lessonRepository.findOneBy(  { id }   );

    if ( !lesson ) throw new NotFoundException( `Lesson ${id} not found` );

    return lesson;
      
    } catch (error) {

      this.handleDbExceptions( error );
      
    }


  }

  async assignClientToLesson (dni: number, id: string) {

    const lesson = await this.lessonRepository.findOne({ where: { id }, relations: { client: true } });
    if (!lesson) throw new NotFoundException( 'Lesson not found' );
    if ( lesson.count === 0 )  throw new BadRequestException( 'Quota full' );

    const client = await this.clientService.findOne(dni);


    if (  client.planStatus === false) throw new BadRequestException( 'Plan expired' );

    if (!lesson.client.find(c => c.dni === client.dni)) {
      lesson.client.push(client);
      lesson.count -= 1;
      await this.lessonRepository.save(lesson);
    }

    return lesson;
  }

  async findClientsLessonList ( id: string  ) {
  
    const lesson = await this.lessonRepository.find({ where: { id }, relations: { client: true } });

    if (!lesson) throw new NotFoundException( 'Lesson not found' );
  
    const clients = lesson.flatMap( item => 
  
        item.client.map(  client  => ({
        name: client.name,
        lastname: client.lastname,
        dni: client.dni
        
      }  ))
  
    );

    return clients;
  
  }
  

  async removeClientFromLesson ( dni: number, id: string ) {

    const lesson: Lesson = await this.lessonRepository.findOne({ where: { id }, relations: { client: true } });
    if (!lesson) throw new NotFoundException( 'Lesson not found' );

    const client: Client = await this.clientService.findOne( dni );

    const findClient: Client = lesson.client.find( c => c.id === client.id );

    if ( !findClient ) throw new NotFoundException( `Client not in lesson ${id}`  );

    lesson.client =  lesson.client.filter( c => c.id !== client.id );

    lesson.count = +lesson.count;
    lesson.count +=1;

    try {

    await this.lessonRepository.save( lesson );

    return lesson;
      
    } catch (error) {

      this.handleDbExceptions( error );
      
    }

  }

  async updateLesson(id: string, updateClientDto: UpdateLessonDto) {

    const findLesson = await this.findOneLesson( id );

    if ( !findLesson ) throw new NotFoundException(  'Lesson not found' );

    const lesson =  { 
      id,
      ...updateClientDto

    } 

    try {

    await this.lessonRepository.save( lesson );
    return lesson;
      
    } catch (error) {

      this.handleDbExceptions( error );
      
    }
  }


  async removeLesson (id: string) {

    const lessonToRemove = await this.findOneLesson( id );

    try {

      await this.lessonRepository.remove( lessonToRemove );

      return  lessonToRemove; 

    } catch (error) {
      
      this.handleDbExceptions( error );

    }
  }

/////////////

private handleDbExceptions (error : any) {

  if (error.code === '23505') throw new BadRequestException(error.detail);

  console.log(error);

  throw new InternalServerErrorException("Unexpected error. Check server logs");

}


private checkForOverlappingLessons(  lesson: Lesson, existingLessons: Lesson[]  ) {

  const [lessonStart, lessonEnd] = lesson.lessonSchedule.split('-').map(time => time.trim());
  const isOverlapping = existingLessons.some(existingLesson => {
      const [existingStart, existingEnd] = existingLesson.lessonSchedule.split('-').map(time => time.trim());
      return (lessonStart < existingEnd) && (lessonEnd > existingStart);
  });

  if (isOverlapping) {
      throw new ConflictException('There is already a lesson scheduled at this time and classroom.');
  }
}

}

