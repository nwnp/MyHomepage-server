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
import { Til } from './tils.entity';
import { User } from './users.entity';

@Entity('TilComment')
export class TilComment {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  TilId: number;

  @Column()
  @IsNumber()
  CommentedUserId: number;

  @Column()
  @IsString()
  til_comment: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => Til, (til) => til.tilComment)
  @JoinColumn([{ name: 'TilId', referencedColumnName: 'id' }])
  til: Til;

  @ManyToOne(() => User, (user) => user.tilComment)
  @JoinColumn([{ name: 'CommentedUserId', referencedColumnName: 'id' }])
  user: User;
}
