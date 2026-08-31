import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Events, Message } from 'discord.js';
import { BotService } from 'src/discord/bot.service';
import { LevelService } from 'src/utils/level.service';
import { MemberService } from 'src/utils/member.service';

@Injectable()
export class XpMessageListener implements OnModuleInit {
  private readonly logger = new Logger(XpMessageListener.name);

  constructor(
    private readonly bot: BotService,
    private readonly levelService: LevelService,
    private readonly memberService: MemberService,
  ) {}

  onModuleInit() {
    const client = this.bot.getClient();
    client.on(Events.MessageCreate, (message) => {
      this.handleMessage(message).catch((err) =>
        this.logger.error('Erreur dans xp-message', err),
      );
    });
  }

  private async handleMessage(message: Message): Promise<void> {
    if (message.author.bot) return;
    if (!message.guild) return;

    const guildId = message.guild.id;
    const settings = await this.levelService.getSettings(guildId);

    const memberRow = await this.memberService.findOrCreate(
      guildId,
      message.author.id,
      message.member?.joinedAt ?? new Date(),
    );

    const now = Date.now();
    if (memberRow.last_xp_at) {
      const elapsedSec = (now - memberRow.last_xp_at.getTime()) / 1000;
      if (elapsedSec < settings.xpCooldownSec) return;
    }

    const gained = Math.floor(settings.xpPerMessage * settings.xpMultiplier);
    const oldLevel = memberRow.current_level;
    const newXp = memberRow.current_xp + gained;
    const newLevel = this.levelService.levelForXp(newXp, settings.maxLevel);

    await this.memberService.updateXp(
      memberRow.id,
      newXp,
      newLevel,
      new Date(now),
    );

    if (newLevel !== oldLevel && message.member) {
      await this.levelService.applyLevelRewards(
        message.member,
        guildId,
        oldLevel,
        newLevel,
      );
    }
  }
}
