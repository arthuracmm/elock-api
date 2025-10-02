import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { PermissionsService } from './permissions.service';
import { UpdatePermissionDto } from './dto/updatePermission.dto';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova permissão' })
  @ApiResponse({ status: 201, description: 'Permissão criada com sucesso.' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os permissãos' })
  async findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar permissão por ID' })
  async findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um permissão pelo ID' })
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um permissão pelo ID' })
  async remove(@Param('id') id: string) {
    await this.permissionService.remove(id);
    return { deleted: id };
  }
}
