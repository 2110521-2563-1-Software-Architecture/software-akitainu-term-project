import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { newUserDto, userDto } from './users.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkUser(accessToken: string) {
    const checkUser = await this.userRepository.findOne({
      where: {
        accessToken,
      },
    });
    return checkUser;
  }

  async createNewUser(newUser: newUserDto): Promise<userDto> {
    const { userName, accessToken } = newUser;
    const checkUser = await this.checkUser(accessToken);
    if (checkUser) {
      throw new BadRequestException('User Already Registered');
    }

    const userId = uuidv4();
    const user: userDto = {
      userId,
      userName,
      userRank: 1,
      userLevel: 1,
    };
    this.userRepository
      .insert({
        ...user,
        accessToken,
      })
      .then(() => {
        console.log('create new user successful');
        console.log('created user: ', userName);
      });

    return user;
  }

  async loginUser(accessToken: string): Promise<userDto> {
    const userWithAccess = await this.checkUser(accessToken);
    if (!userWithAccess) {
      throw new BadRequestException('This user has not registered yet!');
    }
    const { userId, userName, userRank, userLevel } = userWithAccess;
    const user: userDto = {
      userId,
      userName,
      userLevel,
      userRank,
    };
    console.log('login user: ', userName);
    return user;
  }
}
