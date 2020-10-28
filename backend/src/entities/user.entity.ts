import { Entity, PrimaryColumn, Column } from 'typeorm';
import { LoginType } from '../users/users.dto';

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
  snsId: string;

  @Column('text')
  loginType: LoginType;
}
