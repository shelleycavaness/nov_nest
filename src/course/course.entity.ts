import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {ChallengeEntity} from '../challenge/challenge.entity';

@Entity('course')
export class CourseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string


  @OneToMany( type => ChallengeEntity, challenge => challenge.course)
  challenges : ChallengeEntity[];
  
}