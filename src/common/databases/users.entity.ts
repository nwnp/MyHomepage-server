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
import { PostComment } from './post-comment.entity';
import { Follow } from './follows.entity';
import { Calendar } from './calendars.entity';
import { Til } from './tils.entity';
import { TilComment } from './til-comments.entity';
import { Email } from './emails.entity';
import { Feedback } from './feedback.entity';

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
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  name: string;

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

  @Column({
    nullable: true,
    default: 'user',
  })
  @IsString()
  user_type: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post;

  @OneToMany(() => Feedback, (post) => post.user)
  feedbacks: Feedback;

  @OneToMany(() => VisitLog, (log) => log.user)
  logs: VisitLog;

  @OneToMany(() => BGM, (bgm) => bgm.user)
  songs: BGM;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment;

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComment: PostComment;

  @OneToMany(() => Follow, (follow) => follow.followings)
  followings: Follow;

  @OneToMany(() => Follow, (follow) => follow.followers)
  followers: Follow;

  @OneToMany(() => Email, (mail) => mail.mailTo)
  mailTo: Email;

  @OneToMany(() => Email, (mail) => mail.mailFrom)
  mailFrom: Email;

  @OneToMany(() => Calendar, (calendar) => calendar.user)
  calendars: Calendar;

  @OneToMany(() => Til, (til) => til.user)
  tils: Til;

  @OneToMany(() => TilComment, (tilComment) => tilComment.user)
  tilComment: TilComment;
}
