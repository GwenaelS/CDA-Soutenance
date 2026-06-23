import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exempted_role, Filtered_word } from '@wystrelia/shared';
import { Events, Message } from 'discord.js';
import { BotService } from 'src/discord/bot.service';
import { Repository } from 'typeorm';

@Injectable()
export class MessageCreateListener implements OnModuleInit {
  private readonly logger = new Logger(MessageCreateListener.name);

  constructor(
    private readonly bot: BotService,
    @InjectRepository(Filtered_word)
    private readonly filteredWord: Repository<Filtered_word>,
    @InjectRepository(Exempted_role)
    private readonly exemptedRole: Repository<Exempted_role>,
  ) {}

  onModuleInit() {
    const client = this.bot.getClient();
    client.on(Events.MessageCreate, (message) => {
      this.handleMessage(message).catch((err) =>
        this.logger.error('Erreur dans messageCreate', err),
      );
    });
  }

  private async handleMessage(message: Message): Promise<void> {
    // 1. Ignore les bots et les messages privé (hors serveur / MP)
    if (message.author.bot) return;
    if (!message.guild) return;

    // 2. Auteur du message est t'il exempté ?
    const guildId = message.guildId;
    if (!guildId) return;

    const exempted = await this.exemptedRole.find({
      where: { guild: { guild_id: guildId } },
    });
    const exemptedRoleIds = exempted.map((e) => e.role_id);

    const member = message.member;
    if (
      member &&
      member.roles.cache.some((role) => exemptedRoleIds.includes(role.id))
    ) {
      return;
    }

    // 3. Charger les mots interdits
    const filtered = await this.filteredWord.find({
      where: { guild: { guild_id: guildId } },
    });
    if (filtered.length === 0) return;

    // 4. Comparer le contenu du message a la liste des mots interdits
    const content = message.content.toLowerCase();
    const found = filtered.find((fw) =>
      content.includes(fw.word.toLowerCase()),
    );

    // 5. Si un mot interdit est trouvé, on supprime le message
    if (found) {
      await message.delete();
      this.logger.log(
        `Message de ${message.author.tag} supprimé (mot interdit : ${found.word})`,
      );
    }

    // Au futur écrire une log, et envoyer log sur discord
  }
}
