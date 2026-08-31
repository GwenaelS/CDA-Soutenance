import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Events, Guild } from 'discord.js';
import { GuildSyncService } from 'src/discord/guild-sync.service';
import { BotService } from 'src/discord/bot.service';

@Injectable()
export class GuildLifecycleListener implements OnModuleInit {
  private readonly logger = new Logger(GuildLifecycleListener.name);

  constructor(
    private readonly bot: BotService,
    private readonly guildSync: GuildSyncService,
  ) {}

  onModuleInit() {
    const client = this.bot.getClient();

    client.once(Events.ClientReady, (readyClient) => {
      const guilds = [...readyClient.guilds.cache.values()];
      Promise.all(guilds.map((guild) => this.syncGuild(guild))).catch((err) =>
        this.logger.error(
          'Erreur lors de la synchronisation des serveurs',
          err,
        ),
      );
    });

    client.on(Events.GuildCreate, (guild: Guild) => {
      this.syncGuild(guild).catch((err) =>
        this.logger.error(
          `Erreur lors de la synchronisation du serveur ${guild.id}`,
          err,
        ),
      );
    });

    client.on(Events.GuildDelete, (guild: Guild) => {
      // Pas de colonne `active` sur l'entité Guild : on se contente de logger
      // le retrait. À revoir si ce flag est ajouté au schéma.
      this.logger.log(`Bot retiré du serveur ${guild.id} (${guild.name})`);
    });
  }

  private async syncGuild(guild: Guild): Promise<void> {
    await this.guildSync.upsert(guild);
    await this.guildSync.syncMembers(guild);
  }
}
