import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'doorLocks' })
export class DoorLocks extends Model<DoorLocks> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  declare localization: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  declare status: string;
}
