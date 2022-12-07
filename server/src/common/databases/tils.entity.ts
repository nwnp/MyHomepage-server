import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TilComment } from './til-comments.entity';
import { User } from './users.entity';

@Entity('Til')
export class Til {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    nullable: true,
    default: 'nothing title..',
  })
  @IsString()
  title: string;

  @Column({
    nullable: false,
  })
  @IsString()
  til_content: string;

  @Column()
  @IsNumber()
  UserId: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tils)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => TilComment, (tilComment) => tilComment.til)
  tilComment: TilComment;
}
