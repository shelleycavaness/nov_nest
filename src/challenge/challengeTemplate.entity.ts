import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
import {CourseEntity} from '../course/course.entity'
import { RewardEntity } from '../reward/reward.entity';
import {CourseTemplateEntity} from '../course/courseTemplate.entity'

@Entity('challenge_template')
export abstract class ChallengeTemplateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ''})
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  image: string;


  @ManyToMany(() => CourseTemplateEntity, courseTemplate => courseTemplate.challengeTemplates)
  @JoinTable()
  courseTemplates: CourseTemplateEntity[];
  
  @ManyToOne(() => RewardEntity, reward => reward.challengeTemplates)
  reward: RewardEntity;

}
