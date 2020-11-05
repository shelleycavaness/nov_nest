import { Injectable, HttpStatus} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ChallengesRO } from './course.interface'
import {CourseEntity} from './course.entity';

@Injectable()
export class CourseService{
  constructor(
    @InjectRepository(CourseEntity)
      private readonly courseRepository: Repository<CourseEntity>,
    // @InjectRepository(UserEntity)
    //   private readonly userRepository: Repository<UserEntity>,
    ) {}


 //************* find all defi *****************//
 async findAll(): Promise<CourseEntity[]> {
  return await this.courseRepository.find();
  }

  async listChallenges(id: number): Promise<ChallengesRO> {
    console.log('service id===========', id)
    const courseRepository = getRepository(CourseEntity)
    const findChallenges = await courseRepository.findOne({ 
      relations: ["challenges"], //from user.entity  -hasActions
      where: { id: id }
    }); 
    console.log('USER_--------------', findChallenges)
    return findChallenges
  }




  
}