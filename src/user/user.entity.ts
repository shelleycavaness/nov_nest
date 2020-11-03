import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import { IsEmail } from 'class-validator';
import {CourseEntity} from '../course/course.entity'
import * as argon2 from 'argon2';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;


  @Column({default: ''})
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @ManyToMany(type => CourseEntity)
  @JoinTable()
  // @BeforeInsert()
  // updateDates() {
  //     this.createdDate = new Date();
  // }
  user_courses : CourseEntity[];

}
