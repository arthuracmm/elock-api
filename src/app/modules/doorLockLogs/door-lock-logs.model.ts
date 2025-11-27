import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table, CreatedAt } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.model';
import { DoorLocks } from '../doorLocks/door-locks.model';

@Table({ tableName: 'doorLockLogs', timestamps: true, updatedAt: false })
export class DoorLockLog extends Model<DoorLockLog> {
    @ApiProperty()
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare id: number;

    @ApiProperty({ description: 'ID da fechadura' })
    @ForeignKey(() => DoorLocks)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare doorLockId: number;

    @ApiProperty({ description: 'ID do usuário que executou a ação' })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare userId: number;

    @ApiProperty({ description: 'Ação executada: OPEN ou CLOSE' })
    @Column({ type: DataType.STRING(10), allowNull: false })
    declare action: string;

    @ApiProperty({ description: 'Data e hora da ação' })
    @CreatedAt
    @Column({ type: DataType.DATE, allowNull: false })
    declare createdAt: Date;

    @BelongsTo(() => DoorLocks, 'doorLockId')
    declare doorLock: DoorLocks;

    @BelongsTo(() => User, 'userId')
    declare user: User;
}
