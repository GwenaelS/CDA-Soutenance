import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';
import { LogService } from './log.service';

@Controller('guilds/:guildId/logs')
@UseGuards(JwtGuard, GuildGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  findAll(@Param('guildId') guildId: string) {
    return this.logService.findAll(guildId);
  }
}
