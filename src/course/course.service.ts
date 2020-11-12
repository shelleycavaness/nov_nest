import { Injectable, HttpStatus} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ChallengesRO } from './course.interface'
import {CourseEntity} from './course.entity';
import { CourseTemplateEntity } from "./courseTemplate.entity";
import { ChallengeTemplateEntity } from "../challenge/challengeTemplate.entity";

@Injectable()
export class CourseService{
  constructor(
    @InjectRepository(CourseTemplateEntity)
      // private readonly courseRepository: Repository<CourseEntity>,
      private readonly courseTempleteRepository: Repository<CourseTemplateEntity>,
      // @InjectRepository(ChallengeTemplateEntity)
      // private readonly courseRepository: Repository<CourseEntity>,
      // private readonly challengeTempleteRepository: Repository<ChallengeTemplateEntity>,
    // @InjectRepository(UserEntity)
    //   private readonly userRepository: Repository<UserEntity>,
  ) {}


  //************* find all couses *****************//
  // async findAll(): Promise<CourseEntity[]> {
    async findAll(): Promise<CourseTemplateEntity[]> {
    return await this.courseTempleteRepository.find();
  }

  async findCourseById(id: number): Promise<{}> {
    const courseRepository = getRepository(CourseTemplateEntity)
    const findChallenges = await courseRepository.findOne({ 
      relations: ["challengeTemplates"], //from user.entity  -hasActions
      where: { id: id }
    }); 
    // console.log('USER_--------------', findChallenges)
    return findChallenges
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
  async findChallengeById( courseTemplateId: number, challengeTemplateId: number){
    const courseRepository = getRepository(CourseTemplateEntity)
    const findCourse = await courseRepository.findOne({ 
      relations: ["challengeTemplates"], 
      where: { id: courseTemplateId,  }
    }); 
    console.log('number33333',  findCourse.challengeTemplates)
    return findCourse.challengeTemplates[challengeTemplateId -1]
  }
 
}