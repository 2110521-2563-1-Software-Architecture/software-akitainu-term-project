import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameMatch, GameType } from 'src/entities/game-match.entity';
import { Repository } from 'typeorm';
import { CreateGameMatchDto } from './game-match.dto';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameMatchService {
  constructor(
    @InjectRepository(GameMatch)
    private readonly gameMatchRepository: Repository<GameMatch>,
    private readonly usersService: UsersService,
  ) {}

  async getGameMatchByMatchId(matchId: string) {
    const gameMatch = this.gameMatchRepository.findOne({
      where: {
        matchId,
      },
    });
    return gameMatch;
  }

  async addGameMatch(userIds: string[], type: GameType) {
    // userIds = [..,3rd userId, 2nd userId, 1st userId]
    const numberOfUsers: number = userIds.length;
    const finishedTime = new Date();
    let matchId = uuidv4();
    let checkGameMatch = await this.getGameMatchByMatchId(matchId);
    while (checkGameMatch) {
      // Case uuid generate used Id (Is it possible?)
      matchId = uuidv4();
      checkGameMatch = await this.getGameMatchByMatchId(matchId);
    }
    userIds.map(async (userId: string, index: number) => {
      const user = await this.usersService.getUserByUserId(userId);
      if (user) {
        const createGameMatchDto: CreateGameMatchDto = {
          userId,
          matchId,
          result: numberOfUsers - index,
          finishedTime,
          type,
        };
        this.gameMatchRepository.insert(createGameMatchDto);
      }
    });
  }
}
