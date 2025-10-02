import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { Permission } from './permissions.model';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { DoorLocks } from '../doorLocks/door-locks.model';
import { DoorLocksModule } from '../doorLocks/door-locks.module';

@Module({
  imports: [SequelizeModule.forFeature([Permission, DoorLocks]),
    ConfigModule,
  forwardRef(() => DoorLocksModule)
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService]
})
export class PermissionModule { }
