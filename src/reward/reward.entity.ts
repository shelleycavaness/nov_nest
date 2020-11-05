import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { ChallengeEntity } from '../challenge/challenge.entity';

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


}