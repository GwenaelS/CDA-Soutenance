import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Guild as GuildEntity,
  Guild_config,
  Log,
  Log_channel,
  LogType,
} from '@wystrelia/shared';
import { EmbedBuilder, Guild as DiscordGuild } from 'discord.js';
import { Repository } from 'typeorm';

export interface AuditEntryParams {
  guild: DiscordGuild;
  type: LogType;
  targetId: string;
  authorId: string | null;
  reason: string;
  duration?: number | null;
  expireAt?: Date | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
    @InjectRepository(Log_channel)
    private readonly channelLogRepository: Repository<Log_channel>,
    @InjectRepository(Guild_config)
    private readonly guildConfigRepository: Repository<Guild_config>,
  ) {}

  /**
   * Écrit une entrée d'audit immuable en base puis poste un embed de log
   * dans le salon dédié au type d'action (`Log_channel`) ou, à défaut, dans
   * le salon de logs global du serveur (`Guild_config.all_log_channel_id`).
   */
  async record(params: AuditEntryParams): Promise<void> {
    const { guild, type, targetId, authorId, reason, duration, expireAt } =
      params;

    await this.logRepository.save(
      this.logRepository.create({
        guild: { guild_id: guild.id } as GuildEntity,
        type,
        target_id: targetId,
        author_id: authorId ?? '0',
        reason,
        duration: duration ?? null,
        expire_at: expireAt ?? null,
        datetime: new Date(),
      }),
    );

    await this.postLogEmbed(guild, type, targetId, authorId, reason);
  }

  private async postLogEmbed(
    guild: DiscordGuild,
    type: LogType,
    targetId: string,
    authorId: string | null,
    reason: string,
  ): Promise<void> {
    const channelId = await this.resolveLogChannelId(guild.id, type);
    if (!channelId) return;

    const channel = await guild.channels.fetch(channelId).catch(() => null);
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle(`Action de modération : ${type.toUpperCase()}`)
      .addFields(
        { name: 'Cible', value: `<@${targetId}>`, inline: true },
        {
          name: 'Modérateur',
          value: authorId ? `<@${authorId}>` : 'Inconnu',
          inline: true,
        },
        { name: 'Raison', value: reason || 'Aucune raison fournie' },
      )
      .setColor(0xed4245)
      .setTimestamp();

    await channel
      .send({ embeds: [embed] })
      .catch((err) =>
        this.logger.error(
          `Impossible de poster le log dans le salon ${channelId}`,
          err,
        ),
      );
  }

  private async resolveLogChannelId(
    guildId: string,
    type: LogType,
  ): Promise<string | null> {
    const channelLog = await this.channelLogRepository.findOne({
      where: { type, guild: { guild_id: guildId } },
    });
    if (channelLog) return channelLog.channel_id;

    const config = await this.guildConfigRepository.findOne({
      where: { guild: { guild_id: guildId } },
    });
    return config?.all_log_channel_id ?? null;
  }
}
