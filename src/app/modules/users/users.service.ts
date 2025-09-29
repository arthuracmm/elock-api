import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
  ) { }

  async create(data: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password!, 10);
    return this.userModel.create({
      ...data,
      password: hashedPassword,
    } as User);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }


  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    return user.update(data);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
