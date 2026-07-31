import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';
import { GuildService } from './guild.service';

@Controller('guilds')
@UseGuards(JwtGuard, GuildGuard)
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get(':guildId')
  read(@Param('guildId') guildId: string) {
    return this.guildService.findOne(guildId);
  }
}
