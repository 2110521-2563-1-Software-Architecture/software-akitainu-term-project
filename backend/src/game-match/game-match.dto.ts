import { GameType } from 'src/entities/game-match.entity';

export class CreateGameMatchDto {
  userId: any; // todo: convert to string
  matchId: any; // todo: convert to string
  result: number;
  finishedTime: Date;
  type: GameType;
}
