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

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tils)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;
}
