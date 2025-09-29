import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.model';

@Table({ tableName: 'door-locks' })
export class DoorLocks extends Model<DoorLocks> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  declare localization: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  declare status: string;

  @ApiProperty({ description: 'ID do usuário que criou a fechadura' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare createFor: number;
  
  @BelongsTo(() => User)
  declare creator: User;
}
