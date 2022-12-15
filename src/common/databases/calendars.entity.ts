import { User } from 'src/common/databases/users.entity';
import { IsDate, IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './posts.entity';
import { Til } from './tils.entity';

@Entity('Calendar')
export class Calendar {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({ nullable: true })
  @IsNumber()
  PostId: number;

  @Column({ nullable: false })
  @IsNumber()
  UserId: number;

  @Column({ nullable: true })
  @IsNumber()
  TilId: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.calendars)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;

  @OneToOne(() => Post)
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  post: Post;

  @OneToOne(() => Til)
  @JoinColumn([{ name: 'TilId', referencedColumnName: 'id' }])
  til: Til;
}
