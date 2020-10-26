import { Controller, Get, Post, Body } from '@nestjs/common';
import { newUserDto } from './users.dto';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async loginUser(@Body() loginUser) {
    const { accessToken } = loginUser;
    return this.userService.loginUser(accessToken);
  }

  @Post()
  async createNewUser(@Body() newUser: newUserDto) {
    return this.userService.createNewUser(newUser);
  }
}
