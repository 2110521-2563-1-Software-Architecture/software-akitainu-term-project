import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('char', { length: 36 })
  userId: string;

  @Column('varchar', { length: 50 })
  userName: string;

  @Column('integer')
  userRank: number;

  @Column('integer')
  userLevel: number;

  @Column('varchar', { length: 255 })
  accessToken: string;
}
