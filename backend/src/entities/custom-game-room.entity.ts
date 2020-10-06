import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CustomGameRoom {
  @PrimaryGeneratedColumn()
  roomId: number;

  @Column('varchar', { length: 50 })
  chatName: string;
}
