import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';
import { ExemptedRoleService } from './exempted-role.service';
import { UpdateExemptedRoleDto } from './dto/update-exempted-role.dto';
import { CreateExemptedRoleDto } from './dto/create-exempted-role.dto';

@Controller('guilds/:guildId/exempted-roles')
@UseGuards(JwtGuard, GuildGuard)
export class ExemptedRoleController {
  constructor(private readonly exemptedRoleService: ExemptedRoleService) {}

  @Get()
  browse(@Param('guildId') guildId: string) {
    return this.exemptedRoleService.findAll(guildId);
  }

  @Get(':id')
  read(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.exemptedRoleService.findOne(guildId, id);
  }

  @Patch(':id')
  edit(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExemptedRoleDto,
  ) {
    return this.exemptedRoleService.update(guildId, id, dto);
  }

  @Post()
  add(@Param('guildId') guildId: string, @Body() dto: CreateExemptedRoleDto) {
    return this.exemptedRoleService.create(guildId, dto);
  }

  @Delete(':id')
  destroy(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.exemptedRoleService.delete(guildId, id);
  }
}
