import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild as GuildEntity } from '@wystrelia/shared';
import { Guild as DiscordGuild } from 'discord.js';
import { MemberService } from 'src/utils/member.service';
import { Repository } from 'typeorm';

@Injectable()
export class GuildSyncService {
  private readonly logger = new Logger(GuildSyncService.name);

  constructor(
    @InjectRepository(GuildEntity)
    private readonly guildRepository: Repository<GuildEntity>,
    private readonly memberService: MemberService,
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

  /**
   * Crée une ligne `Member` pour chaque membre déjà présent sur le serveur
   * (hors bots) qui n'en a pas encore. Sans ça, un membre présent avant le
   * déploiement du bot n'apparaît en base qu'à sa première activité (message,
   * vocal, sanction) au lieu d'être visible dès le démarrage (ex. `/top`).
   */
  async syncMembers(guild: DiscordGuild): Promise<void> {
    const members = await guild.members.fetch();
    let created = 0;

    for (const member of members.values()) {
      if (member.user.bot) continue;

      try {
        const existing = await this.memberService.find(guild.id, member.id);
        if (existing) continue;

        await this.memberService.findOrCreate(
          guild.id,
          member.id,
          member.joinedAt ?? new Date(),
        );
        created++;
      } catch (err) {
        this.logger.warn(
          `Impossible de synchroniser le membre ${member.id} sur ${guild.id}`,
          err,
        );
      }
    }

    if (created > 0) {
      this.logger.log(
        `${created} membre(s) synchronisé(s) pour le serveur ${guild.name}`,
      );
    }
  }
}
