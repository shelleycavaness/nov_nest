import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import {CourseEntity} from '../course/course.entity'
@Entity('challenge')
export class ChallengeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @ManyToOne(type => CourseEntity, course => course.challenges)
  course: CourseEntity

}