import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Permission } from './permissions.model';


@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission) private permissionModel: typeof Permission,
  ) { }

  async create(data: Partial<Permission>): Promise<Permission> {
    return this.permissionModel.create(data as Permission)
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.findAll();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findByPk(id);
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(id: string, data: Partial<Permission>): Promise<Permission> {
    const permission = await this.findOne(id);
    return permission.update(data);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await permission.destroy();
  }
}
