import { Injectable, HttpStatus} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ChallengesRO } from './course.interface'
import {CourseEntity} from './course.entity';
import { CourseTemplateEntity } from "./courseTemplate.entity";

@Injectable()
export class CourseService{
  constructor(
    @InjectRepository(CourseTemplateEntity)
      private readonly courseTempleteRepository: Repository<CourseTemplateEntity>,
      @InjectRepository(CourseEntity)
      private readonly courseRepository: Repository<CourseEntity>,
  ) {}


  //************* find all couses *****************//
  // async findAll(): Promise<CourseEntity[]> {
    async findAll(): Promise<CourseTemplateEntity[]> {
    return await this.courseTempleteRepository.find();
  }

  //search for a users valid course umber
  async findUsersCourseById(id: number): Promise<ChallengesRO> {
    const courseRepository = getRepository(CourseEntity)
    const findChallenges = await courseRepository.findOne({ 
      relations: ["challenges"], //from user.entity  -hasActions
      where: { id: id }
    }); 
    if(findChallenges == undefined){  console.error('ooops course id not found',findChallenges )}
    else{
      // console.log('USER_--------------', findChallenges)
    return findChallenges
    }
    
  }

  async listAllChallengesFromCourseId(id: number): Promise<{}> {
    const courseRepository = getRepository(CourseTemplateEntity)
    const findChallenges = await courseRepository.findOne({ 
      relations: ["challengeTemplates"], //from user.entity  -hasActions
      where: { id: id }
    }); 
    return findChallenges.challengeTemplates //returns an array of challenges
  }

  ///***/       not working well undefined       /***//
  // async findChallengeById( courseTemplateId: number, challengeTemplateId: number){
  //   const courseRepository = getRepository(CourseTemplateEntity)
  //   const findCourse = await courseRepository.findOne({ 
  //     relations: ["challengeTemplates"], 
  //     where: { id: courseTemplateId,  }
  //   }); 
  //   console.log('number33333',  findCourse.challengeTemplates)
  //   return findCourse.challengeTemplates[challengeTemplateId -1]
  // }
 
}