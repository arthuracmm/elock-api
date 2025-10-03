import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DoorLocks } from './door-locks.model';
import { DoorLockUserService } from '../doorLockUsers/door-locks-users.service';
import { CreateDoorLocksDto } from './dto/createDoorLocks.dto';


@Injectable()
export class DoorLocksService {
  constructor(
    @InjectModel(DoorLocks)
    private doorLocksModel: typeof DoorLocks,

    @Inject(forwardRef(() => DoorLockUserService))
    private doorLockUserService: DoorLockUserService,
  ) { }

  async create(data: CreateDoorLocksDto, userId: number) {
    const createdDoorLock = await this.doorLocksModel.create(data as DoorLocks);

    await this.doorLockUserService.create({
      userId,
      doorLockId: createdDoorLock.id,
      paper: 'owner',
      status: 'active',
    });

    return createdDoorLock;
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
