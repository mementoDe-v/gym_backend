import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Lesson } from './entities/lesson.entity';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { Client } from 'src/clients/entities/client.entity';


@ApiTags( 'Lessons' )
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiTags( 'Lessons' )

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Create a lesson',})
  @ApiResponse( { status: 201, description: 'Lesson created', type: Lesson } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Post()
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Assing a client to a lesson', })
  @ApiResponse( { status: 201, description: 'Client assigned', type: Lesson } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )
  
  @Post(':id/assign-client/:dni')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  async assignClientToLesson(
    @Param('dni', ParseIntPipe) dni: number,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.lessonsService.assignClientToLesson(dni, id);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Find one lesson', })
  @ApiResponse( { status: 201, description: 'Lesson found', type: Lesson } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findOneLesson(
    @Param('id', ParseUUIDPipe) id: string, ) {
    return this.lessonsService.findOneLesson( id );
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Find all lessons', })
  @ApiResponse( { status: 201, description: 'Lesson found', type: [Lesson] } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get()
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findAllLessons() {
    return this.lessonsService.findAllLessons();
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Find all clients in the specified lesson id', })
  @ApiResponse( { status: 201, description: 'Clients found', type: [Client] } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get('client-list/:id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findClientLessonList ( @Param('id', ParseUUIDPipe) id: string ) {
    return this.lessonsService.findClientsLessonList( id );
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Update a lesson', })
  @ApiResponse( { status: 201, description: 'Lesson updated', type: Lesson } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Patch(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  updateLesson(
    @Param( 'id', ParseUUIDPipe ) id: string, 
    @Body() updateLessonDto: UpdateLessonDto
    ) {
    return this.lessonsService.updateLesson(id, updateLessonDto);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Remove a client from specified lesson', })
  @ApiResponse( { status: 201, description: 'Lesson updated', type: Lesson } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Patch(':id/remove-client/:dni')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  removeClientFromLesson(
    @Param('dni', ParseIntPipe) dni: number,
    @Param( 'id' , ParseUUIDPipe) id: string
    ) {
    return this.lessonsService.removeClientFromLesson(dni, id);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Remove a lesson', })
  @ApiResponse( { status: 201, description: 'Lesson deleted', type: Lesson } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Delete(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  removeLesson( @Param('id', ParseUUIDPipe) id: string ) { 
    return this.lessonsService.removeLesson(id);
  }


}
