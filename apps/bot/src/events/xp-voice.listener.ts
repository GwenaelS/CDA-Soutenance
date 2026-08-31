import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Events, VoiceState } from 'discord.js';
import { BotService } from 'src/discord/bot.service';
import { AuditService } from 'src/utils/audit.service';
import { LevelService } from 'src/utils/level.service';
import { MemberService } from 'src/utils/member.service';

@Injectable()
export class XpVoiceListener implements OnModuleInit {
  private readonly logger = new Logger(XpVoiceListener.name);
  // Clé `${guildId}:${userId}` -> timestamp d'entrée en vocal (hors AFK)
  private readonly joinTimestamps = new Map<string, number>();

  constructor(
    private readonly bot: BotService,
    private readonly levelService: LevelService,
    private readonly memberService: MemberService,
    private readonly auditService: AuditService,
  ) {}

  onModuleInit() {
    const client = this.bot.getClient();
    client.on(Events.VoiceStateUpdate, (oldState, newState) => {
      this.handleVoiceStateUpdate(oldState, newState).catch((err) =>
        this.logger.error('Erreur dans xp-voice', err),
      );
    });
  }

  private key(guildId: string, userId: string): string {
    return `${guildId}:${userId}`;
  }

  private async handleVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState,
  ): Promise<void> {
    const member = newState.member ?? oldState.member;
    if (!member || member.user.bot) return;

    const guildId = newState.guild.id;
    const afkChannelId = newState.guild.afkChannelId;
    const key = this.key(guildId, member.id);

    if (oldState.serverMute !== newState.serverMute) {
      await this.auditService.postSimpleEmbed(
        newState.guild,
        newState.serverMute ? 'Server mute détecté' : 'Server unmute détecté',
        [{ name: 'Membre', value: `<@${member.id}>` }],
      );
    }

    const wasInVoice =
      !!oldState.channelId && oldState.channelId !== afkChannelId;
    const isInVoice =
      !!newState.channelId && newState.channelId !== afkChannelId;

    if (!wasInVoice && isInVoice) {
      this.joinTimestamps.set(key, Date.now());
      return;
    }

    if (wasInVoice && !isInVoice) {
      const joinedAt = this.joinTimestamps.get(key);
      this.joinTimestamps.delete(key);
      if (!joinedAt) return;

      const minutes = Math.floor((Date.now() - joinedAt) / 60000);
      if (minutes < 1) return;

      const settings = await this.levelService.getSettings(guildId);
      const memberRow = await this.memberService.findOrCreate(
        guildId,
        member.id,
        member.joinedAt ?? new Date(),
      );

      const gained = Math.floor(
        minutes * settings.xpPerVoiceMinute * settings.xpMultiplier,
      );
      const oldLevel = memberRow.current_level;
      const newXp = memberRow.current_xp + gained;
      const newLevel = this.levelService.levelForXp(newXp, settings.maxLevel);

      await this.memberService.updateXp(
        memberRow.id,
        newXp,
        newLevel,
        memberRow.last_xp_at,
      );

      if (newLevel !== oldLevel) {
        await this.levelService.applyLevelRewards(
          member,
          guildId,
          oldLevel,
          newLevel,
        );
      }
    }
  }
}
