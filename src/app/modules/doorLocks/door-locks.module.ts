import { Module } from '@nestjs/common';
import { SequelizeModule} from '@nestjs/sequelize';
import { DoorLocksService} from './door-locks.service';
import { DoorLocksController} from './door-locks.controller';
import { DoorLocks } from './door-locks.model';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([DoorLocks, User]), ConfigModule],
  controllers: [DoorLocksController],
  providers: [DoorLocksService],
})
export class DoorLocksModule{}
