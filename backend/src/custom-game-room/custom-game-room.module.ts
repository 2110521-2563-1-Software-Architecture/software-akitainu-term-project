import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomGameRoomGateway } from './custom-game-room.gateway';
import { CustomGameRoomService } from './custom-game-room.service';
import { ChatService } from './chat.service';
import { CustomGameRoomController } from './custom-game-room.controller';

@Module({
  imports: [],
  controllers: [CustomGameRoomController],
  providers: [CustomGameRoomGateway, CustomGameRoomService, ChatService],
  exports: [],
})
export class CustomGameRoomModule {}
