import { Controller, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameRoomDto } from './game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create')
  async createGameRoom(@Body() createGameRoomDto: CreateGameRoomDto) {
    return this.gameService.createGameRoom(createGameRoomDto);
  }
}
