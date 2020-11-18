import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { newUserDto, UserProgressDto } from './users.dto';
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
    return this.userService.createNewUser(newUser);
  }

  @Patch('progress/:userId')
  async updateUserProgress(
    @Param('userId') userId: string,
    @Body() userProgressDto: UserProgressDto,
  ) {
    return this.userService.updateUserProgress(userId, userProgressDto);
  }

  @Patch('changeUserName/:userId')
  async changeUserName(@Param('userId') userId: string, @Body() { userName }) {
    return this.userService.changeUserName(userId, userName);
  }

  @Get('leaderboard')
  async getServerLeaderBoard() {
    return this.userService.getServerLeaderBoard();
  }

  @Get(':userId')
  async getUserByUserId(@Param('userId') userId: string) {
    return this.userService.getUserByUserId(userId);
  }
}
