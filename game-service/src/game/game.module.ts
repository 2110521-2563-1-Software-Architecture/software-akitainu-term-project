import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameGateway, GameService],
  exports: [],
})
export class GameModule {}
