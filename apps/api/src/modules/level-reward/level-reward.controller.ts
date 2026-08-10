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
import { LevelRewardService } from './level-reward.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';
import { UpdateLevelRewardDto } from './dto/update-level-reward.dto';
import { CreateLevelRewardDto } from './dto/create-level-reward.dto';

@Controller('guilds/:guildId/xp/rewards')
@UseGuards(JwtGuard, GuildGuard)
export class LevelRewardController {
  constructor(private readonly levelRewardService: LevelRewardService) {}

  @Get()
  browse(@Param('guildId') guildId: string) {
    return this.levelRewardService.findAll(guildId);
  }

  @Get(':id')
  read(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.levelRewardService.findOne(guildId, id);
  }

  @Patch(':id')
  edit(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLevelRewardDto,
  ) {
    return this.levelRewardService.update(guildId, id, dto);
  }

  @Post()
  add(@Param('guildId') guildId: string, @Body() dto: CreateLevelRewardDto) {
    return this.levelRewardService.create(guildId, dto);
  }

  @Delete(':id')
  destroy(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.levelRewardService.delete(guildId, id);
  }
}
