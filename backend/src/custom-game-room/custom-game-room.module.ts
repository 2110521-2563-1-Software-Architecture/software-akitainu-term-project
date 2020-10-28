import { Module } from '@nestjs/common';
import { CustomGameRoomGateway } from './custom-game-room.gateway';
import { CustomGameRoomService } from './custom-game-room.service';
import { ChatService } from './chat.service';
import { CustomGameRoomController } from './custom-game-room.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CustomGameRoomController],
  providers: [CustomGameRoomGateway, CustomGameRoomService, ChatService],
  exports: [],
})
export class CustomGameRoomModule {}
