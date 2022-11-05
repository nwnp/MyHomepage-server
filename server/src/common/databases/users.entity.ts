import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VisitLog } from './visit-logs.entity';
import { Post } from './posts.entity';
import { BGM } from './bgms.entity';
import { Comment } from './comment.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @IsEmail()
  email: string;

  @Column({
    nullable: false,
  })
  @IsString()
  password: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @IsString()
  nickname: string;

  @Column({
    nullable: true,
    default: 'male',
  })
  @IsString()
  gender: string;

  @Column({
    default: 'jobless',
    nullable: true,
  })
  @IsString()
  job: string;

  @Column({
    nullable: true,
    default: 'gitless',
  })
  @IsString()
  githubUrl: string;

  @Column({
    nullable: true,
    default: 'blogless',
  })
  @IsString()
  blogUrl: string;

  @Column({ nullable: true, type: 'varchar', length: '1000' })
  @IsString()
  refreshToken: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post;

  @OneToMany(() => VisitLog, (log) => log.user)
  logs: VisitLog;

  @OneToMany(() => BGM, (bgm) => bgm.user)
  songs: BGM;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment;
}
