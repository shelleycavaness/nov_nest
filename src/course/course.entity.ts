import { type } from 'os';
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne} from 'typeorm';
import { Expose } from 'class-transformer'; //

import {ChallengeEntity} from '../challenge/challenge.entity';
import { UserEntity } from '../user/user.entity';

@Entity('course')
export class CourseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string

  @Column({ default: false })
  isCompleted: boolean


  @OneToMany( type => ChallengeEntity, challenge => challenge.course)
  challenges : ChallengeEntity[]

  @ManyToOne(type => UserEntity, user => user.courses)
  user: UserEntity
  // @OneToMany( type => FunFactEntity, funFact => funFact.course)
  // challenges : FunFactEntity[];
  


  @Expose()
  get totalKw(): number {
    let totalKw = 0;
    this.challenges.forEach(challenge => {
      totalKw += challenge.reward.rewardKw;
    });
    return totalKw;
  }

  @Expose()
  get totalH2O(): number {
    let totalH2O = 0;
    this.challenges.forEach(challenge => {
      totalH2O += challenge.reward.rewardH2O;
    });
    return totalH2O;
  }

  @Expose()
  get totalCo2(): number {
    let totalCo2 = 0;
    this.challenges.forEach(challenge => {
      totalCo2 += challenge.reward.rewardCo2;
    });
    return totalCo2;
  }

  @Expose()
  get totalGamePoints(): number {
    let totalGamePoints = 0;
    this.challenges.forEach(challenge => {
      totalGamePoints += challenge.reward.gamePoints;
    });
    return totalGamePoints;
  }


}