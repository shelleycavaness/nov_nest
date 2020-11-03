import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';
import { UserService } from './user.service';
import { UserRO, UserWithChallenges, UserWithChallengesRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { UserEntity } from './user.entity';


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

  /**********   get all defis by a user with a jwt to identify the user************/
  /** creaded a userWithActions interface, and added hasAcions list,   **/
  // @ApiOperation({ summary: 'Get challenges from a user' })
  // @ApiResponse({ status: 200, description: 'Return users parcours.'})
  // @ApiResponse({ status: 403, description: 'Forbidden invalid token.' })
  // @Get('player')
// async getUserDefi(@User('id') userId: number): Promise<{}> {
  // async getUserDefi(@User('id') userId: number): Promise<UserWithChallenges> {

  //   const user = await this.userService.userWithChallenges(userId)
  //   const userWithoutPwd = {
  //     id: user.id,
  //     username: user.username,
  //     email: user.email,
  //     image: user.image,
  //     token: user.token,
  //     user_courses: user.user_courses
  //   }
  //     return userWithoutPwd
  // }





}
