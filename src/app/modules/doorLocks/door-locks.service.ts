import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DoorLocks } from './door-locks.model';
import { PermissionsService } from '../permissions/permissions.service';


@Injectable()
export class DoorLocksService {
  constructor(
    @InjectModel(DoorLocks)
    private doorLocksModel: typeof DoorLocks,

    @Inject(forwardRef(() => PermissionsService))
    private permissionService: PermissionsService,
  ) {}

   async create(data: Partial<DoorLocks>) {
    const doorLock = await this.doorLocksModel.create(data as DoorLocks);

    await this.permissionService.create({
      idDoorlock: doorLock.id,
      levelAcess: 'admin',
    });

    return doorLock;
  }

  async findAll(): Promise<DoorLocks[]> {
    return this.doorLocksModel.findAll();
  }

  async findOne(id: string): Promise<DoorLocks> {
    const doorLocks = await this.doorLocksModel.findByPk(id);
    if (!doorLocks) throw new NotFoundException('Door lock not found');
    return doorLocks;
  }

  async update(id: string, data: Partial<DoorLocks>): Promise<DoorLocks> {
    const doorLocks = await this.findOne(id);
    return doorLocks.update(data);
  }

  async remove(id: string): Promise<void> {
    const doorLocks = await this.findOne(id);
    await doorLocks.destroy();
  }
}
