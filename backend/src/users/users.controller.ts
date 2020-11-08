import { Controller, Get, Post, Body, Query, Param, Patch } from '@nestjs/common';
import { newUserDto, userProgressDto } from './users.dto';
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

  @Get(':userId')
  async getUserByUserId(@Param('userId') userId: string) {
    return this.userService.getUserByUserId(userId);
  }

  @Patch('progress/:userId')
  async updateUserProgress(@Param('userId') userId: string, @Body() userProgressDto: userProgressDto) {
    console.log(userProgressDto);
    return this.userService.updateUserProgress(userId, userProgressDto);
  }
}
