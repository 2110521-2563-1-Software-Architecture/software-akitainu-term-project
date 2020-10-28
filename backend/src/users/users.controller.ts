import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { newUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
