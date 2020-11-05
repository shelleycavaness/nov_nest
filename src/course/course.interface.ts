import {ChallengeEntity } from '../challenge/challenge.entity';
export interface CourseData {
  id: number;
  title: string;
  isCompleted: boolean;
  challenges : ChallengesRO;
}

export interface ChallengesRO {
 challenges : ChallengeEntity[]
}