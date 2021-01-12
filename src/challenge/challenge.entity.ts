import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from 'typeorm';
import {CourseEntity} from '../course/course.entity'
import { RewardEntity } from '../reward/reward.entity'
// import { ChallengeTemplateEntity } from './challengeTemplate.entity'

@Entity('challenge')
export class ChallengeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ''})
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  image: string;

  @Column({ default: false })
  isCompleted: boolean

  @Column({type:'date', nullable: true})
  startedOn: Date;
  
  @Column({type:'date', nullable: true})
  completedOn: Date;

  @ManyToOne(() => CourseEntity, course => course.challenges)
  course: CourseEntity;
  
  @ManyToOne(() => RewardEntity, reward => reward.challenges)
  reward: RewardEntity;
  
  // custom contructor to fix array in userService
  // constructor(params: ChallengeTemplateEntity) {
  //   this.title = params.title
  //   this.description = params.description
  //   this.reward = params.reward
  //   this.isCompleted = false
  // }

}