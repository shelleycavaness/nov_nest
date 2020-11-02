import { HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ProfileRO, ProfileData } from './profile.interface';
import {HttpException} from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
   
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(options?: DeepPartial<UserEntity>): Promise<ProfileRO> {
    const user = await this.userRepository.findOne(options);
    delete user.id;
    if (user) delete user.password;
    return {profile: user};
  }

  async findProfile(id: number, followingUsername: string): Promise<ProfileRO> {
    const _profile = await this.userRepository.findOne( {username: followingUsername});

    if(!_profile) return;

    let profile: ProfileData = {
      username: _profile.username,
      image: _profile.image
    };

    // const follows = await this.followsRepository.findOne( {followerId: id, followingId: _profile.id});

    // if (id) {
    //   profile.following = !!follows;
    // }

    return {profile};
  }

 

}
