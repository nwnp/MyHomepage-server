import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('Comment')
export class Comment {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({ nullable: true })
  @IsString()
  comment: string;

  @Column()
  @IsNumber()
  UserId: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;
}
