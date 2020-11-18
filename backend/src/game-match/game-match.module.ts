import { Module } from '@nestjs/common';
import { GameMatchService } from './game-match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameMatch } from 'src/entities/game-match.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameMatch]), UsersModule],
  providers: [GameMatchService],
  exports: [GameMatchService],
})
export class GameMatchModule {}
