import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DoorLocksModule } from './doorLocks/door-locks.module';
import { DoorLockUserModule } from './doorLockUsers/door-locks-users.module';

@Module({
  imports: [
    UsersModule,
    DoorLocksModule,
    AuthModule,
    DoorLockUserModule
  ],
  exports: [
    UsersModule,
    DoorLocksModule,
    AuthModule,
    DoorLockUserModule
  ],
})
export class IndexModule { }