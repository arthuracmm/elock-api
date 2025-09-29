import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DoorLocksModule } from './doorLocks/door-locks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    DoorLocksModule,
    AuthModule
  ],
  exports: [
    UsersModule,
    DoorLocksModule,
    AuthModule
  ],
})
export class IndexModule { }