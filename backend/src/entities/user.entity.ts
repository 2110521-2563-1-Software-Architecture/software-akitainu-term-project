import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: string;

  @Column('varchar', { length: 50 })
  userName: string;
}
