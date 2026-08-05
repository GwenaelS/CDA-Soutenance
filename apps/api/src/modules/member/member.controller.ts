import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';

@Controller('guilds/:guildId/members')
@UseGuards(JwtGuard, GuildGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  findAll(@Param('guildId') guildId: string) {
    return this.memberService.findAll(guildId);
  }

  @Get(':discordUserId')
  findOne(
    @Param('guildId') guildId: string,
    @Param('discordUserId') discordUserId: string,
  ) {
    return this.memberService.findOne(guildId, discordUserId);
  }
}
