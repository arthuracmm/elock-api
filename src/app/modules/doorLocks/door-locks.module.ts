import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoorLocksService } from './door-locks.service';
import { DoorLocksController } from './door-locks.controller';
import { DoorLocks } from './door-locks.model';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/user.model';
import { AuthModule } from '../auth/auth.module';
import { Permission } from '../permissions/permissions.model';
import { PermissionModule } from '../permissions/permission.module';

@Module({
  imports: [SequelizeModule.forFeature([DoorLocks, User, Permission]),
    ConfigModule,
    AuthModule,
    forwardRef(() => PermissionModule)
  ],
  controllers: [DoorLocksController],
  providers: [DoorLocksService],
})
export class DoorLocksModule { }
