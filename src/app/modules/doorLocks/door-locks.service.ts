import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DoorLocks } from './door-locks.model';
import { DoorLockUserService } from '../doorLockUsers/door-locks-users.service';
import { DoorLocksGateway } from './door-locks.gateway';
import { User } from '../users/user.model';
import { CreateDoorLocksDto } from './dto/createDoorLocks.dto';
import { DoorLockUser } from '../doorLockUsers/door-locks-users.model';

@Injectable()
export class DoorLocksService {
  constructor(
    @InjectModel(DoorLocks)
    private doorLocksModel: typeof DoorLocks,

    @Inject(forwardRef(() => DoorLockUserService))
    private doorLockUserService: DoorLockUserService,
    @Inject(forwardRef(() => DoorLocksGateway))
    private doorLocksGateway?: DoorLocksGateway,
  ) { }

  async create(data: CreateDoorLocksDto, userId: number) {
    const createdDoorLock = await this.doorLocksModel.create(data as DoorLocks);

    await this.doorLockUserService.create({
      userId,
      doorLockId: createdDoorLock.id,
      paper: 'owner',
      status: 'active',
    });

    try {
      this.doorLocksGateway?.emitDoorLockUpdated(createdDoorLock);
    } catch (err) { }
    return createdDoorLock;
  }

  async findAll(): Promise<DoorLocks[]> {
    return this.doorLocksModel.findAll();
  }

  async findAllForUser(userId: number): Promise<DoorLocks[]> {
    if (!userId) return [];

    return this.doorLocksModel.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          through: { attributes: [] },
          required: true,
        },
      ],
    });
  }

  async findOne(id: string): Promise<DoorLocks> {
    const doorLocks = await this.doorLocksModel.findByPk(id);
    if (!doorLocks) throw new NotFoundException('Door lock not found');
    return doorLocks;
  }

  async findOneForUser(id: string, userId: number): Promise<DoorLocks> {
    const doorLock = await this.doorLocksModel.findOne({
      where: { id },
      include: [
        {
          model: User,
          where: { id: userId },
          through: { attributes: [] },
          required: true,
        },
      ],
    });

    if (!doorLock)
      throw new NotFoundException('Door lock not found or access denied');
    return doorLock;
  }

  async update(id: string, data: Partial<DoorLocks>): Promise<DoorLocks> {
    const doorLocks = await this.findOne(id);
    const updated = await doorLocks.update(data);
    try {
      this.doorLocksGateway?.emitDoorLockUpdated(updated);
    } catch (err) { }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const doorLocks = await this.findOne(id);
    await doorLocks.destroy();
    try {
      this.doorLocksGateway?.emitDoorLockRemoved(Number(id));
    } catch (err) { }
  }

  // --- Statistics Methods (Mock Data) ---

  async getOverviewStats(userId: number) {
    const doorLocks = await this.findAllForUser(userId);
    const totalLocks = doorLocks.length;
    const activeLocks = doorLocks.filter((lock) => lock.status === 'on').length;
    const inactiveLocks = totalLocks - activeLocks;

    // Mock total accesses (random number between 50 and 200)
    const totalAccesses = Math.floor(Math.random() * 150) + 50;

    return {
      totalLocks,
      activeLocks,
      inactiveLocks,
      totalAccesses,
    };
  }

  async getUsageTimeline(userId: number) {
    // Mock timeline data for the last 7 days
    const now = new Date();
    const timeline: Array<{ date: string; opens: number; closes: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      timeline.push({
        date: dateStr,
        opens: Math.floor(Math.random() * 20) + 5,
        closes: Math.floor(Math.random() * 20) + 5,
      });
    }

    return timeline;
  }

  async getMostUsedLocks(userId: number) {
    const doorLocks = await this.findAllForUser(userId);

    // Mock usage count for each lock
    const locksWithUsage = doorLocks.map((lock) => ({
      id: lock.id,
      name: lock.name,
      usageCount: Math.floor(Math.random() * 100) + 10,
    }));

    // Sort by usage count descending
    locksWithUsage.sort((a, b) => b.usageCount - a.usageCount);

    // Return top 5
    return locksWithUsage.slice(0, 5);
  }

  async getStatusDistribution(userId: number) {
    const doorLocks = await this.findAllForUser(userId);
    const active = doorLocks.filter((lock) => lock.status === 'on').length;
    const inactive = doorLocks.length - active;

    return [
      { name: 'Ativas', value: active },
      { name: 'Inativas', value: inactive },
    ];
  }

  async getRecentActivity(userId: number) {
    const doorLocks = await this.findAllForUser(userId);
    const activities: Array<{
      id: number;
      lockName: string;
      action: string;
      user: string;
      timestamp: string;
    }> = [];
    const actions = ['OPEN', 'CLOSE'];
    const users = ['Hugo', 'Maria', 'João', 'Ana'];

    // Generate 10 random activities
    for (let i = 0; i < 10; i++) {
      const randomLock =
        doorLocks[Math.floor(Math.random() * doorLocks.length)];
      if (!randomLock) continue;

      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - i);

      activities.push({
        id: i + 1,
        lockName: randomLock.name,
        action: actions[Math.floor(Math.random() * actions.length)],
        user: users[Math.floor(Math.random() * users.length)],
        timestamp: timestamp.toISOString(),
      });
    }

    return activities;
  }
}
