import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DoorLocksModule } from './doorLocks/door-locks.module';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permissions/permission.module';

@Module({
  imports: [
    UsersModule,
    DoorLocksModule,
    AuthModule,
    PermissionModule
  ],
  exports: [
    UsersModule,
    DoorLocksModule,
    AuthModule,
    PermissionModule
  ],
})
export class IndexModule { }