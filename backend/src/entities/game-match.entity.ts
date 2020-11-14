import { Entity, PrimaryColumn, Column } from 'typeorm';

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
}
