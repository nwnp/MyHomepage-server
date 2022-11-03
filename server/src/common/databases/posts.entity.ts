import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  UserId: number;

  @Column({
    nullable: false,
    default: 'nothing title..',
  })
  @IsString()
  title: string;

  @Column({
    nullable: false,
    default: 'nothing content..',
  })
  @IsString()
  content: string;

  @Column({
    nullable: true,
    default: 'nothing',
  })
  @IsString()
  imageUrl: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;
}
