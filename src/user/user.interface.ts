import { ChallengeEntity } from "../challenge/challenge.entity";
import { CourseEntity } from "../course/course.entity";

export interface UserData {
  username: string;
  email: string;
  token: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}

export interface  UserWithCourses {
  id: number;
  username: string;
  email: string;
  // token: string;
  totalGamePoints: number;
  totalKw: number;
  totalH2O: number;
  totalCo2: number;
  image?: string;
  courses : CourseEntity[];
}
export interface  UserCourseWithChallenges {
  id: number;
  username: string;
  courses : ChallengeEntity[];
}

