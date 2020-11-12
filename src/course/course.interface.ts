import {ChallengeEntity } from '../challenge/challenge.entity';
import { ChallengeTemplateEntity } from '../challenge/challengeTemplate.entity';


export interface CourseData {
  id: number;
  title: string;
  isCompleted: boolean;
  challenges : ChallengesRO;
}

export interface ChallengesRO {
 challenges : ChallengeEntity[]
}

export interface CourseTemplate {
  challengeTemplates: ChallengeTemplateEntity[]

}