import { IsDate, IsEmail, IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('Email')
export class Email {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    nullable: false,
  })
  @IsEmail()
  to: string; // 메일을 받는 사람

  @Column({
    nullable: false,
  })
  @IsEmail()
  from: string; // 메일을 보내는 사람

  @Column({
    nullable: false,
    default: 'nothing title',
  })
  subject: string;

  @Column({
    nullable: false,
    default: 'nothing content',
  })
  text: string;

  @CreateDateColumn()
  @IsDate()
  date_sent: Date;

  @ManyToOne(() => User, (user) => user.mailTo)
  @JoinColumn([{ name: 'to', referencedColumnName: 'id' }])
  mailTo: User;

  @ManyToOne(() => User, (user) => user.mailFrom)
  @JoinColumn([{ name: 'from', referencedColumnName: 'id' }])
  mailFrom: User;
}
