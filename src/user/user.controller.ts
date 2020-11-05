import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';
import { UserService } from './user.service';
import { UserRO, UserWithCourses  } from './user.interface';
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

  /***  get with a jwt to identify the user's courses http://localhost:3000/api/player *****/
  /** creaded a userWithActions interface, and added hasAcions list,   **/
  @ApiOperation({ summary: 'Get challenges from a user' })
  @ApiResponse({ status: 200, description: 'Return users parcours.'})
  @ApiResponse({ status: 403, description: 'Forbidden invalid token.' })
  @Get('player')
  async getUserWithCourses(@User('id') userId: number): Promise<UserWithCourses> {

    const userWithChal = await this.userService.userWithCourses(userId)
    const userWithoutPwd = {
      id: userWithChal.id,
      username: userWithChal.username,
      email: userWithChal.email,
      image: userWithChal.image,
      // token: userWithChal.token,
      courses: userWithChal.courses
    }
      return userWithoutPwd
  }





}
