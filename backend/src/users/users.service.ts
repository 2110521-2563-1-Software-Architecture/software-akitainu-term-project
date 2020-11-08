import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { newUserDto, userDto, LoginType, loginUserDto, userProgressDto, editUserDto } from './users.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkUser(snsId: string, loginType: LoginType) {
    const checkUser = await this.userRepository.findOne({
      where: {
        snsId,
        loginType,
      },
    });
    return checkUser;
  }

  async createNewUser(newUser: newUserDto): Promise<userDto> {
    const { userName, snsId, loginType } = newUser;
    const checkUser = await this.checkUser(snsId, loginType);
    if (checkUser) {
      throw new BadRequestException('User Already Registered');
    }

    const userId = uuidv4();
    const user: userDto = {
      userId,
      userName,
      userRank: 1,
      userLevel: 1,
      userExp: 0,
    };
    this.userRepository
      .insert({
        ...user,
        snsId,
        loginType,
      })
      .then(() => {
        console.log('create new user successful');
        console.log('created user: ', userName);
      });

    return user;
  }

  async loginUser(loginUser: loginUserDto): Promise<userDto> {
    // console.log("login",loginUser)
    const { snsId, loginType } = loginUser;
    const userWithAccess = await this.checkUser(snsId, loginType);
    if (!userWithAccess) {
      throw new BadRequestException('This user has not registered yet!');
    }
    const { userId, userName, userRank, userLevel, userExp } = userWithAccess;
    const user: userDto = {
      userId,
      userName,
      userLevel,
      userRank,
      userExp,
    };
    console.log('login user: ', userName);
    return user;
  }

  async getUserName(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        userId,
      },
    });
    if (!user) {
      return userId;
    }
    return user.userName;
  }

  async getUserByUserId(userId: string) {
    const ret = await this.userRepository.findOne({
      select: ['userId', 'userName', 'userRank', 'userLevel', 'userExp'],
      where: {
        userId: userId,
      },
    });
    if (!ret) throw new BadRequestException('Invalid UserId');
    return ret;
  }

  async updateUserProgress(userId: string, userProgressDto: userProgressDto) {
    const { userExp, userRank, userLevel } = userProgressDto; // new EXP and new rank

    const user = await this.getUserByUserId(userId);
    if(userLevel < user.userLevel) 
      throw new BadRequestException('Error: new level cannot be less than old level');
    if(userRank && Math.abs(user.userRank-userRank) > 2) 
      throw new BadRequestException('Error: invalid rank');

    const editUserDto: editUserDto = {
      userId,
      userRank,
      userLevel,
      userExp,
    };
    const ret = await this.userRepository.save(editUserDto);
    if (!ret) throw new BadRequestException('Invalid UserId');
    return ret;
  }
}
