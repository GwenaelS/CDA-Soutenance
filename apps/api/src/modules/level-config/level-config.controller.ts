import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { LevelConfigService } from './level-config.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';
import { UpdateLevelConfigDto } from './dto/update-level-config.dto';

@Controller('guilds/:guildId/xp/config')
@UseGuards(JwtGuard, GuildGuard)
export class LevelConfigController {
  constructor(private readonly levelConfigService: LevelConfigService) {}

  @Get()
  read(@Param('guildId') guildId: string) {
    return this.levelConfigService.findOne(guildId);
  }

  @Patch()
  edit(@Param('guildId') guildId: string, @Body() dto: UpdateLevelConfigDto) {
    return this.levelConfigService.update(guildId, dto);
  }
}
