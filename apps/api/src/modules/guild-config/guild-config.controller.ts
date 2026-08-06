import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';
import { GuildConfigService } from './guild-config.service';
import { UpdateGuildConfigDto } from './dto/update-guild-config.dto';

@Controller('guilds/:guildId/config')
@UseGuards(JwtGuard, GuildGuard)
export class GuildConfigController {
  constructor(private readonly guildConfigService: GuildConfigService) {}

  @Get()
  read(@Param('guildId') guildId: string) {
    return this.guildConfigService.findOne(guildId);
  }

  @Patch()
  edit(@Param('guildId') guildId: string, @Body() dto: UpdateGuildConfigDto) {
    return this.guildConfigService.update(guildId, dto);
  }
}
