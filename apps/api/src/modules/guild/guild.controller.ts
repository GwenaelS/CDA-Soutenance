import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';
import { GuildService } from './guild.service';
import type { Request } from 'express';

@Controller('guilds')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get()
  @UseGuards(JwtGuard)
  findAll(@Req() req: Request) {
    return this.guildService.findAll(req.user.guilds);
  }

  @Get(':guildId')
  @UseGuards(JwtGuard, GuildGuard)
  read(@Param('guildId') guildId: string) {
    return this.guildService.findOne(guildId);
  }
}
