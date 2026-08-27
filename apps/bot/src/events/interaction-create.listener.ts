import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommandRegistryService } from 'src/commands/command-registry.service';
import { BotService } from 'src/discord/bot.service';
import { Events, Interaction } from 'discord.js';

@Injectable()
export class InteractionCreateListener implements OnModuleInit {
  private readonly logger = new Logger(InteractionCreateListener.name);

  constructor(
    private readonly bot: BotService,
    private readonly commands: CommandRegistryService,
  ) {}

  onModuleInit() {
    const client = this.bot.getClient();
    client.on(Events.InteractionCreate, (interaction) => {
      this.handleInteraction(interaction).catch((err) =>
        this.logger.error('Erreur dans interactionCreate', err),
      );
    });
  }

  private async handleInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = this.commands.get(interaction.commandName);
    if (!command) {
      this.logger.warn(`Commande inconnue reçue : ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      this.logger.error(
        `Erreur lors de l'exécution de la commande ${interaction.commandName}`,
        err instanceof Error ? err.stack : err,
      );

      const payload = {
        content: 'Une erreur est survenue.',
        ephemeral: true,
      } as const;

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload).catch(() => undefined);
      } else {
        await interaction.reply(payload).catch(() => undefined);
      }
    }
  }
}
