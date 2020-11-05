import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import {CourseEntity} from '../course/course.entity'
import { RewardEntity } from '../reward/reward.entity';

@Entity('challenge')
export abstract class ChallengeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ''})
  title: string;

  @Column({default: ''})
  description: string;

  @Column({ default: false })
  isCompleted: boolean

  @Column({type:'date'})
  startedOn: Date;
  
  @Column({type:'date'})
  completedOn: Date;

  @ManyToOne(() => CourseEntity, course => course.challenges)
  course: CourseEntity;
  
  @OneToOne(() => RewardEntity)
  @JoinColumn()
  reward: RewardEntity;

}