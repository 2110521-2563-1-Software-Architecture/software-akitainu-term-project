import { Controller } from '@nestjs/common';
import { newUserDto } from './users.dto';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern('loginUser')
  async loginUser(loginUser) {
    return this.userService.loginUser(loginUser);
  }

  @MessagePattern('createNewUser')
  async createNewUser(newUser: newUserDto) {
    return this.userService.createNewUser(newUser);
  }

  @MessagePattern('getUserByUserId')
  async getUserByUserId(userId: string) {
    return this.userService.getUserByUserId(userId);
  }

  @MessagePattern('updateUserProgress')
  async updateUserProgress(userProgress) {
    const { userId, userProgressDto } = userProgress;
    return this.userService.updateUserProgress(userId, userProgressDto);
  }
}
