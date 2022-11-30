import { User } from './users.entity';
import { IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Follow')
export class Follow {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    type: 'int',
    unique: true,
    nullable: false,
  })
  @IsNumber()
  FollowingId: number; // '나'를 팔로우 하고 있는 유저 id

  @Column({
    type: 'int',
    unique: true,
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
