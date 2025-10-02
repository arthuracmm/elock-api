import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  idDoorlock: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  levelAcess: string;
}
