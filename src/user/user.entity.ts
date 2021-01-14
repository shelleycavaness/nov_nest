import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany} from 'typeorm';
import { Expose } from 'class-transformer'; //
import { IsEmail } from 'class-validator';
import {CourseEntity} from '../course/course.entity'
import * as argon2 from 'argon2';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({default: 'https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHVnJTIwZG9nfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'})
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @OneToMany(type => CourseEntity, course => course.user)
  courses: CourseEntity[]

  @Expose()
  get totalKw(): number {
    let totalKw = 0;
    this.courses.forEach(course => {
      totalKw += course.totalKw;
    });
    return totalKw;
  }

  @Expose()
  get totalH2O(): number {
    let totalH2O = 0;
    this.courses.forEach(course => {
      totalH2O += course.totalH2O;
    });
    return totalH2O;
  }

  @Expose()
  get totalCo2(): number {
    let totalCo2 = 0;
    this.courses.forEach(course => {
      totalCo2 += course.totalCo2
    });
    return totalCo2;
  }

  @Expose()
  get totalGamePoints(): number {
    let totalGamePoints = 0;
    this.courses.forEach(course => {
      totalGamePoints += course.totalGamePoints;
    });
    return totalGamePoints;
  }

}
