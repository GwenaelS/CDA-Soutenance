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
import { LogChannelService } from './log-channel.service';
import { UpdateLogChannelDto } from './dto/update-log-channel.dto';
import { CreateLogChannelDto } from './dto/create-log-channel.dto';

@Controller('guilds/:guildId/log-channels')
@UseGuards(JwtGuard, GuildGuard)
export class LogChannelController {
  constructor(private readonly logChannelService: LogChannelService) {}

  @Get()
  browse(@Param('guildId') guildId: string) {
    return this.logChannelService.findAll(guildId);
  }

  @Get(':id')
  read(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.logChannelService.findOne(guildId, id);
  }

  @Patch(':id')
  edit(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLogChannelDto,
  ) {
    return this.logChannelService.update(guildId, id, dto);
  }

  @Post()
  add(@Param('guildId') guildId: string, @Body() dto: CreateLogChannelDto) {
    return this.logChannelService.create(guildId, dto);
  }

  @Delete(':id')
  destroy(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.logChannelService.delete(guildId, id);
  }
}
