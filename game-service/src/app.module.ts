import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { UsersService } from './users.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [],
  controllers: [],
  providers: [GameGateway, GameService, UsersService],
})
export class AppModule {}
