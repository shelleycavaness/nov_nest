import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
const jwt = require('jsonwebtoken');
import * as argon2 from 'argon2';
import { SECRET } from '../config';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { CourseEntity } from '../course/course.entity';
import {CreateUserDto, LoginUserDto, UpdateUserDto} from './dto';
import { UserRO, UserWithCourses } from './user.interface';
import {CourseTemplateEntity} from '../course/courseTemplate.entity'
import {ChallengeEntity} from '../challenge/challenge.entity'
import { ChallengeTemplateEntity } from '../challenge/challengeTemplate.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(CourseTemplateEntity)
    private readonly courseTemplateRepository: Repository<CourseTemplateEntity>,
    @InjectRepository(ChallengeEntity)
    private readonly challengeRepository: Repository<ChallengeEntity>,
    @InjectRepository(ChallengeEntity)
    private readonly challengeTemplateRepository: Repository<ChallengeTemplateEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne({email, password}: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({email});
    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    // check uniqueness of username/email
    const {username, email, password} = dto;
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      const errors = {username: 'Username and email must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    // create new user
    let newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      const _errors = {username: 'Userinput is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);

    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUserRO(savedUser);
    }

  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOne(id);
    delete toUpdate.password;

    let updated = Object.assign(toUpdate, dto);
    return await this.userRepository.save(updated);
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email: email});
  }

  async findById(id: number): Promise<UserRO>{
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = {User: ' not found'};
      throw new HttpException({errors}, 401);
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<UserRO>{
    const user = await this.userRepository.findOne({email: email});
    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };

  private buildUserRO(user: UserEntity) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: this.generateJWT(user),
      image: user.image
    };
    return {user: userRO};
  }

  /************ get all finished belonging to a user's  **************/

  async userWithChallenges(id: number) {
  }

  /**** get all courses and stats belonging to a user's  **************/
    async userWithInfo(id: number): Promise<UserWithCourses> {
    const userRepository = getRepository(UserEntity)
    const findUserInfo = await userRepository.findOne({ 
      relations: ["courses", "courses.challenges", "courses.challenges.reward"],
      where: { id: id }
    }); 
    // Error - check to see if user exists
    if (!findUserInfo) {
      throw new Error('invalid because the user doesnt exist')
    }
    return findUserInfo
  }

  /************ add course to a user's courses **************/
  async addCourse(userId: number, courseTemplateId: number): Promise<UserWithCourses> {
    // 1- Get the user with id
    const user = await this.userRepository.findOne({
      relations: ["courses"],
      where: { id: userId }
    })
    // Error - check to see if user exists
    if (!user) {
      throw new Error('invalid because the user doesnt exist')
    }

    // 2- Get the courseTemplate with challengeTemplates with id
    //const [courseTemplates] is equal to courseTemplates[0]
    const courseTemplates = await this.courseTemplateRepository.find({
      relations: ["challengeTemplates", "challengeTemplates.reward"],
      where: { id: courseTemplateId }
    })
    const courseTemplate = courseTemplates[0]

   //Error-   Check to see if course Template exists
    if (!courseTemplate) {
      throw new Error('invalid because the courseTemplate doesnt exist')
    }

    // 2.1 Check if course with same title as courseTemplate is already in user courses
    // If so raise an exception (ie throw an error that will be caught in the controller)
    user.courses.forEach(element => {
      if(courseTemplate.title == element.title){
        throw new Error('invalid because this course already exists for the user, choose new course')
      }
    }); 

    
    // 3- Create a course instance with its challenges from template
    const course = new CourseEntity()
    course.title = courseTemplate.title
    course.isCompleted = false
    course.challenges = []
    course.user = user   // adds the user to course
    // 4- Save the course with user
    this.courseRepository.save(course)

    // // 5- Iterate through all challengTemplates of the courseTemplate
    courseTemplate.challengeTemplates.forEach(challengeTemplate => {
    //   // 5.1- Create a ChallengeEntity instance from the challengeTemplate
      const newChallenge = new ChallengeEntity()
      newChallenge.title = challengeTemplate.title
      newChallenge.description = challengeTemplate.description
      newChallenge.isCompleted = false
      newChallenge.reward = challengeTemplate.reward
      // 5.2- Link the course to the challenge
      newChallenge.course = course
      // 5.3- Save the challenge
      this.challengeRepository.save(newChallenge)
    });

    // // 6- Save User
    this.userRepository.save(user)

    // 7- return user dto
    // console.log('user', user)
    return user
  }

  // TODO: Remove course from user's course
  async removeCourse() {
    // TODO: 1- Get user's course from id
  // 1- Get the user with id
  
    // TODO: 2- Delete course from db

    // TODO: 3- Return course dto

  }

  // Accept Challenge
  async acceptChallenge(challengeId: number): Promise <ChallengeEntity>{
    // 1- Get user's challenge from id
    const challenge = await this.challengeRepository.findOne(challengeId)

    if (!challenge) {
      throw Error("challenge is null!")
    }
    
    // 2- Set challenge start date to today
    challenge.startedOn = new Date()
    
    // 3- Save
    this.challengeRepository.save(challenge)

    // 4- Return challenge dto
    return challenge
  }

  // Complete Challenge
  async completeChallenge(challengeId: number): Promise <ChallengeEntity>{
    // 1- Get user's challenge from id
    const challenge = await this.challengeRepository.findOne({
      relations: ['course'],
      where: { id: challengeId }
    })

    if (!challenge) {
      throw Error("challenge is null!")
    }
    
    // 2- Set challenge end date to today
    challenge.completedOn = new Date
    
    // 3- Set challenge isCompleted to true
    challenge.isCompleted = true

    // 4- Save
    this.challengeRepository.save(challenge)


    //  import the course from DB to reset the course properties
    //  the course entity needs accest to the challenges
    //  what are you retriveing from db and the relationship
    const challengeCourse = await this.courseRepository.findOne({
      relations: ['challenges'],
      where: { id: challenge.course.id }
    })

    // TODO: check if all challenges in course are completed
    if (challengeCourse.checkIsCompleted()) {
      this.courseRepository.update(challengeCourse.id, { isCompleted: true })
      challenge.course.isCompleted = true
    }

    // 5- Return challenge dto
    return challenge
  }

}
