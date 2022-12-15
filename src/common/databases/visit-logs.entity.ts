import { IsDate, IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('VisitLog')
export class VisitLog {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  VisitedUserId: number;

  @Column()
  @IsDate()
  visitedDate: Date;

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn([{ name: 'VisitedUserId', referencedColumnName: 'id' }])
  user: User;
}
