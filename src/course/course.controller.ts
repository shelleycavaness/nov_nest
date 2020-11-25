import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseService } from "./course.service";
import { CourseEntity } from './course.entity';
import {CourseTemplateEntity} from './courseTemplate.entity';
import { ChallengesRO,CourseData } from './course.interface';

@ApiBearerAuth()
@ApiTags('playing')
@Controller('playing')
export class CourseController {
  constructor(private readonly courseService : CourseService) {}
  /************* get all items *******************/
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'Return all of the groups of challenges.'})
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  async findAll(): Promise<CourseTemplateEntity[]> {
    return await this.courseService.findAll();
  }

   /**********  display an array of challenges for front************/
   @ApiOperation({ summary: 'Get all challenges a users course' })
   @ApiResponse({ status: 200, description: 'Return challenges from group.'})
   @ApiResponse({ status: 403, description: 'Forbidden invalid token.' })
   @Get('course/:id')
   async getAllChallengesWithCourseId(@Param('id') courseId: number): Promise<{}> {
   //rework the promose with a interface CourseRO object
     const group = await this.courseService.findUsersCourseById(courseId)
     return group
   }
//**************get challenge inside a parcours by id *******************//
  // @ApiOperation({ summary: 'find a challenge by id' })
  // @ApiResponse({ status: 200, description: 'get a challenge by id.'})
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // @Get(':courseTemplateId/course/:challengeTemplateId')
  // async getChallengeById(@Param('courseTemplateId') courseTemplateId: number, 
  //  @Param('challengeTemplateId') challengeTemplateId: number): Promise<{}> {
  //   return await this.courseService.findChallengeById(courseTemplateId, challengeTemplateId);
  // }



}