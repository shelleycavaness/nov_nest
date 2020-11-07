import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { CourseTemplateEntity } from '../course/courseTemplate.entity'
import { AuthMiddleware } from './auth.middleware';
import { CourseEntity } from '../course/course.entity';
import { ChallengeEntity } from '../challenge/challenge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CourseTemplateEntity, CourseEntity, ChallengeEntity]),],
  providers: [UserService],
  controllers: [
    UserController
  ],
  exports: [UserService]
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'user', method: RequestMethod.GET}, {path: 'user', method: RequestMethod.PUT});
  }
}
