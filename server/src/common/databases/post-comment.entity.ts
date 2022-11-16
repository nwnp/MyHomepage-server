import { IsNumber, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './posts.entity';
import { User } from './users.entity';

@Entity('PostComment')
export class PostComment {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  PostId: number;

  @Column()
  @IsNumber()
  CommentedUserId: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  post: Post;

  @ManyToOne(() => User, (user) => user.postComments)
  @JoinColumn([{ name: 'CommentedUserId', referencedColumnName: 'id' }])
  user: User;
}
