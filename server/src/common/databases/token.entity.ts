import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('Token')
export class Token {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    unique: true,
    nullable: true,
  })
  @IsString()
  refreshToken: string;

  @OneToOne(() => User, (user) => user.token)
  user: User;
}
