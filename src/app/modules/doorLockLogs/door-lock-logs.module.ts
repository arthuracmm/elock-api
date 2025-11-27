import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoorLockLog } from './door-lock-logs.model';
import { DoorLockLogsService } from './door-lock-logs.service';

@Module({
    imports: [SequelizeModule.forFeature([DoorLockLog])],
    providers: [DoorLockLogsService],
    exports: [DoorLockLogsService],
})
export class DoorLockLogsModule { }
