import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from 'typeorm';
import {ChallengeTemplateEntity} from '../challenge/challengeTemplate.entity';

@Entity('courseTemplate')
export class CourseTemplateEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string

  @Column({ default: false })
  isAvailable: boolean

  @ManyToMany( () => ChallengeTemplateEntity, challengeTemplate => challengeTemplate.courseTemplates)
  challengeTemplates : ChallengeTemplateEntity[]
  
}