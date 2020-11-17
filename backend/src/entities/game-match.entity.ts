import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum GameType {
  rank = 'rank',
  custom = 'custom',
}

@Entity()
export class GameMatch {
  @PrimaryColumn('char', { length: 36 })
  userId: number;

  @PrimaryColumn('char', { length: 36 })
  matchId: number;

  @Column('integer')
  result: number;

  @Column('timestamp')
  finishedTime: Date;

  @Column('enum', {
    enum: GameType,
    default: GameType.custom,
  })
  type: GameType;
}
