import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseService } from "./course.service";
import { CourseEntity } from './course.entity';
import { ChallengesRO,CourseData } from './course.interface'

@ApiBearerAuth()
@ApiTags('playing')
@Controller('playing')
export class CourseController {
  constructor(private readonly courseService : CourseService) {}
//************* get all items *******************//
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'Return all of the groups of challenges.'})
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  async findAll(): Promise<CourseEntity[]> {
  
    return await this.courseService.findAll();
  }

  /**********   get all challenges in a parcours/group************/
  @ApiOperation({ summary: 'Get all challenges in a group by its id' })
  @ApiResponse({ status: 200, description: 'Return challenges from group.'})
  @ApiResponse({ status: 403, description: 'Forbidden invalid token.' })
  @Get(':id')
  async getAllChallenges(@Param('id') courseId: number): Promise<{}> {
  //rework the promose with a interface CourseRO object
    const group = await this.courseService.listChallenges(courseId)
    return group
  }




}