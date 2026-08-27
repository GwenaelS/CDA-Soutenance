import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild as GuildEntity } from '@wystrelia/shared';
import { Guild as DiscordGuild } from 'discord.js';
import { Repository } from 'typeorm';

@Injectable()
export class GuildSyncService {
  constructor(
    @InjectRepository(GuildEntity)
    private readonly guildRepository: Repository<GuildEntity>,
  ) {}

  /**
   * Upsert la ligne `Guild` correspondant au serveur Discord. Nécessaire
   * avant toute écriture référençant ce serveur (Log, Member, ...) à cause
   * de la contrainte de clé étrangère.
   */
  async upsert(guild: DiscordGuild): Promise<void> {
    await this.guildRepository.upsert(
      { guild_id: guild.id, guild_name: guild.name },
      ['guild_id'],
    );
  }
}
