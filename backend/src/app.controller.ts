import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { newUserDto, UserProgressDto } from './users.dto';

@Controller('users')
export class AppController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async loginUser(@Query() loginUser) {
    return this.userService.loginUser(loginUser);
  }

  @Post()
  async createNewUser(@Body() newUser: newUserDto) {
    return this.userService.createNewUser(newUser);
  }

  @Get(':userId')
  async getUserByUserId(@Param('userId') userId: string) {
    return this.userService.getUserByUserId(userId);
  }

  @Patch('progress/:userId')
  async updateUserProgress(
    @Param('userId') userId: string,
    @Body() userProgressDto: UserProgressDto,
  ) {
    console.log(userProgressDto);
    return this.userService.updateUserProgress(userId, userProgressDto);
  }
}
