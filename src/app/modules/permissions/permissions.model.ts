import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DoorLocks } from '../doorLocks/door-locks.model';

@Table({ tableName: 'permissions' })
export class Permission extends Model<Permission> {
    @ApiProperty()
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare id: string;

    @ApiProperty()
    @ForeignKey(() => DoorLocks)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare idDoorlock: number;

    @ApiProperty()
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    declare levelAcess: string;

    @BelongsTo(() => DoorLocks)
    declare creator: DoorLocks;
}
