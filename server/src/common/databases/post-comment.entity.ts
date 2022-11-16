import { IsNumber, IsDate, IsString } from 'class-validator';
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

  @Column()
  @IsString()
  post_comment: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.postComment)
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  post: Post;

  @ManyToOne(() => User, (user) => user.postComment)
  @JoinColumn([{ name: 'CommentedUserId', referencedColumnName: 'id' }])
  user: User;
}
