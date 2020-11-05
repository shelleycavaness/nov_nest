import {ChallengeEntity } from '../challenge/challenge.entity';
export interface CourseData {
  id: number;
  title: string;
  challenges : ChallengesRO;
}
// export interface CourseRO {
//   // courseWithChallenges: CourseData;
//   // id: number;

//   title: string;
//   challenges : ChallengeEntity[];
// }
export interface ChallengesRO {
 challenges : ChallengeEntity[]
}