import { User } from './users.entity';
import { IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

//TODO: 내가 로그인 했을 때, 나를 팔로우하고 있는 User list 가져오는 Join SQL 작성

@Entity('Follow')
export class Follow {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    type: 'int',
    unique: false,
    nullable: false,
  })
  @IsNumber()
  FollowingId: number; // '나'를 팔로우 하고 있는 유저 id

  @Column({
    type: 'int',
    unique: false,
    nullable: false,
  })
  @IsNumber()
  FollowerId: number; // '내'가 팔로우 하고 있는 유저 id

  @ManyToOne(() => User, (user) => user.followings)
  @JoinColumn([{ name: 'FollowingId', referencedColumnName: 'id' }])
  followings: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn([{ name: 'FollowerId', referencedColumnName: 'id' }])
  followers: User;
}
