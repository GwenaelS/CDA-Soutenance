import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WarningService } from './warning.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import type { Request } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';

@Controller('guilds/:guildId/members/:discordUserId/warnings')
@UseGuards(JwtGuard, GuildGuard)
export class WarningController {
  constructor(private readonly warningService: WarningService) {}

  @Get()
  browse(
    @Param('guildId') guildId: string,
    @Param('discordUserId') discordUserId: string,
  ) {
    return this.warningService.findAll(guildId, discordUserId);
  }

  @Get(':id')
  read(
    @Param('guildId') guildId: string,
    @Param('discordUserId') discordUserId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.warningService.findOne(guildId, discordUserId, id);
  }

  @Post()
  add(
    @Param('guildId') guildId: string,
    @Param('discordUserId') discordUserId: string,
    @Body() dto: CreateWarningDto,
    @Req() req: Request,
  ) {
    return this.warningService.create(
      guildId,
      discordUserId,
      req.user.sub,
      dto,
    );
  }

  @Patch(':id')
  revoke(
    @Param('guildId') guildId: string,
    @Param('discordUserId') discordUserId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.warningService.revoke(guildId, discordUserId, id);
  }
}
