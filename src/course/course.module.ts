import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthMiddleware } from "../user/auth.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "./course.entity";
import { CourseService } from './course.service';
import {CourseController} from './course.controller';


// import { AuthMiddleware } from './auth.middleware';


@Module({
  imports : [TypeOrmModule.forFeature([CourseEntity, ])],
  providers: [CourseService],
  controllers: [CourseController]
})
export class CourseModule implements NestModule{
  public configure(consumer : MiddlewareConsumer){
    consumer
    .apply(AuthMiddleware)
    // .forRoutes()
  }
}