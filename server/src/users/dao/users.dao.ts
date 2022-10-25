import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/databases/users.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UsersDao {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private DataSource: DataSource,
  ) {}

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }
}
