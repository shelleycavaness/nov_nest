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

export interface  UserWithChallenges {
  id: number;
  username: string;
  email: string;
  // token: string;
  image?: string;
  user_courses : CourseEntity[];
}

export interface UserWithChallengesRO {
  userWithChal: UserWithChallenges;
}