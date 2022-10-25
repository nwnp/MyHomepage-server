import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('BGM')
export class BGM {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    nullable: false,
  })
  @IsString()
  title: string;

  @Column({
    nullable: false,
  })
  @IsString()
  singer: string;

  @Column()
  @IsNumber()
  UserId: number;

  @ManyToOne(() => User, (user) => user.songs)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;
}
