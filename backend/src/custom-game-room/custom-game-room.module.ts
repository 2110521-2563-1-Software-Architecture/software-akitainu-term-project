import { Module } from '@nestjs/common';
import { CustomGameRoomGateway } from './custom-game-room.gateway';
import { CustomGameRoomService } from './custom-game-room.service';
import { ChatService } from './chat.service';
import { CustomGameRoomController } from './custom-game-room.controller';
import { UsersModule } from '../users/users.module';
import { GameMatchModule } from 'src/game-match/game-match.module';

@Module({
  imports: [UsersModule, GameMatchModule],
  controllers: [CustomGameRoomController],
  providers: [CustomGameRoomGateway, CustomGameRoomService, ChatService],
  exports: [],
})
export class CustomGameRoomModule {}
