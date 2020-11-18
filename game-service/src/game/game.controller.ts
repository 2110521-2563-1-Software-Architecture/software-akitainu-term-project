import { Controller, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameRoomDto } from './game.dto';
import { GameGateway } from './game.gateway';

@Controller('games')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly gameGateway: GameGateway,
  ) {}

  @Post('create')
  async createGameRoom(@Body() createGameRoomDto: CreateGameRoomDto) {
    const roomId = await this.gameService.createGameRoom(createGameRoomDto);
    setTimeout(async () => {
      await this.gameGateway.onStartGame({ roomId });
      console.log('start game');
    }, 5000);
    return { roomId };
  }
}
