import { Controller, Get, Post, Body, Query,Req } from '@nestjs/common';
import { newUserDto } from './users.dto';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async loginUser(@Query() loginUser) {
    return this.userService.loginUser(loginUser);
  }

  @Post()
  async createNewUser(@Body() newUser: newUserDto) {
    // console.log(newUser)
    return this.userService.createNewUser(newUser);
  }
}
