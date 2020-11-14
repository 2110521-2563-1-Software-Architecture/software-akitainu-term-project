import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class GameMatch {
  @PrimaryColumn('integer')
  userId: number;

  @PrimaryColumn('integer')
  matchId: number;

  @Column('integer')
  result: number;

  @Column('timestamp')
  finishedTime: Date;
}
