import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { ChallengeEntity } from '../challenge/challenge.entity';
import { ChallengeTemplateEntity } from '../challenge/challengeTemplate.entity';

@Entity('reward')
export class RewardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 0})
  rewardKw: number;

  @Column({default: 0})
  rewardCo2: number;

  @Column({default: 0})
  rewardH2O: number;
  
  @Column({default: 0})
  gamePoints: number;

  @OneToMany(() => ChallengeEntity, challenge => challenge.reward)
  challenges: ChallengeEntity[]

  @OneToMany(() => ChallengeTemplateEntity, challengeTemplate => challengeTemplate.reward)
  challengeTemplates: ChallengeTemplateEntity[]

}