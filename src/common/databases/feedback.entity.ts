import { IsNumber, IsString, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('Feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  UserId: number;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;
}
