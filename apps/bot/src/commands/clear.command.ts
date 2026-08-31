import { Injectable, Logger } from '@nestjs/common';
import { LogType } from '@wystrelia/shared';
import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { AuditService } from 'src/utils/audit.service';
import { hasPermission } from 'src/utils/permission-check';
import { Command } from './command.interface';

export const clearCommandData = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Supprime plusieurs messages du salon courant')
  .addIntegerOption((option) =>
    option
      .setName('nombre')
      .setDescription('Nombre de messages à supprimer (1-100, défaut 10)')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

@Injectable()
export class ClearCommand implements Command {
  private readonly logger = new Logger(ClearCommand.name);
  readonly data = clearCommandData;

  constructor(private readonly auditService: AuditService) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { guild, member, channel } = interaction;

    if (!guild || !(member instanceof GuildMember)) {
      await interaction.reply({
        content: 'Cette commande ne peut être utilisée que dans un serveur.',
        ephemeral: true,
      });
      return;
    }

    if (!hasPermission(member, PermissionFlagsBits.ManageMessages)) {
      await interaction.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
        ephemeral: true,
      });
      return;
    }

    if (!channel || channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content:
          'Cette commande ne peut être utilisée que dans un salon textuel.',
        ephemeral: true,
      });
      return;
    }

    const amount = interaction.options.getInteger('nombre') ?? 10;

    const deleted = await channel.bulkDelete(amount, true);

    await this.auditService.record({
      guild,
      type: LogType.CLEAR,
      targetId: channel.id,
      authorId: member.id,
      reason: `Suppression de ${deleted.size} message(s)`,
    });

    await interaction.reply({
      content: `🧹 **${deleted.size}** message(s) supprimé(s).`,
      ephemeral: true,
    });

    this.logger.log(
      `${deleted.size} messages supprimés dans #${channel.name} par ${member.user.tag}`,
    );
  }
}
