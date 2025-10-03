import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoorLocksService } from './door-locks.service';
import { DoorLocksController } from './door-locks.controller';
import { DoorLocks } from './door-locks.model';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { DoorLockUserModule } from '../doorLockUsers/door-locks-users.module';

@Module({
  imports: [SequelizeModule.forFeature([DoorLocks]),
    ConfigModule,
    AuthModule,
  forwardRef(() => DoorLockUserModule),
  ],
  controllers: [DoorLocksController],
  providers: [DoorLocksService],
  exports: [DoorLocksService],
})
export class DoorLocksModule { }
