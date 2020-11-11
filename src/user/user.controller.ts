import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserCourseWithChallenges, UserRO, UserWithCourses  } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { UserEntity } from './user.entity';
import { ChallengeEntity } from '../challenge/challenge.entity';
import { CourseEntity } from '../course/course.entity';
import { ChallengeTemplateEntity } from '../challenge/challengeTemplate.entity';

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @Put('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }
  /***  login user  http://localhost:3000/api/users/login *****/
  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = {User: ' not found'};
    if (!_user) throw new HttpException({errors}, 401);

    const token = await this.userService.generateJWT(_user);
    const {email, username, image} = _user;
    const user = {email, token, username,  image};
    return {user}
  }

  /*** get all courses associated with a user, use jwt to identify the user  *****/
  /** http://localhost:3000/api/player  **/
  @ApiOperation({ summary: 'Get course from a user' })
  @ApiResponse({ status: 200, description: 'Return users parcours.'})
  @ApiResponse({ status: 403, description: 'Forbidden invalid token.' })
  @Get('player')
  async getUserWithInfo(@User('id') userId: number): Promise<UserWithCourses> {
    const userWithChal = await this.userService.userWithInfo(userId)
    const userWithoutPwd = {
      id: userWithChal.id,
      username: userWithChal.username,
      email: userWithChal.email,
      image: userWithChal.image,
      totalGamePoints: userWithChal.totalGamePoints,
      totalKw: userWithChal.totalKw,
      totalH2O: userWithChal.totalH2O,
      totalCo2: userWithChal.totalCo2,
      courses: userWithChal.courses
    } 
    return userWithoutPwd
  }

  
  /************ Remember that the token will take preference over the id  **************/
  /************ add Course to a user **************/
  @ApiOperation({ summary: 'Add a course to a user' })
  @ApiResponse({ status: 200, description: 'course added to user'})
  @ApiResponse({ status: 403, description: 'Forbidden invalid token.' })  
  @Put('user/:userId/course/:courseTemplateId/add')
  async addCourse(@Param('userId') userId: number, @Param('courseTemplateId') courseTemplateId: number): Promise<UserWithCourses> {
    return this.userService.addCourse(userId, courseTemplateId)
  }


  /************ User Accepts Challenge  **************/
  @ApiOperation({ summary: 'User Accepts challenge' })
  @ApiResponse({ status: 200, description: 'challege date updated on challenge table'})
  @ApiResponse({ status: 403, description: 'Forbidden invalid token.' })  
  @Put('user/challenge/:challengeId/accept')
  async acceptChallenge(@Param('challengeId') challengeId: number): Promise< ChallengeEntity> {
    return await this.userService.acceptChallenge(challengeId)
  }


  /************ User Completes Challenge  **************/
  @ApiOperation({ summary: 'User Completes Challenge' })
  @ApiResponse({ status: 200, description: 'challenge completed by user'})
  @ApiResponse({ status: 403, description: 'Forbidden invalid token.' })  
  @Put('user/challenge/:challengeId/complete')
  async completeChallenge(@Param('challengeId') challengeId: number): Promise< ChallengeEntity> {
    return await this.userService.completeChallenge(challengeId)
  }

}
