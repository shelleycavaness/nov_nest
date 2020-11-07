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
  // password: string;
  image?: string;
  courses : CourseEntity[];
}

