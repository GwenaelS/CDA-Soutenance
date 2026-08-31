import { Injectable, Logger } from '@nestjs/common';
import { LogType } from '@wystrelia/shared';
import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { AuditService } from 'src/utils/audit.service';
import { canModerate, hasPermission } from 'src/utils/permission-check';
import { Command } from './command.interface';

export const untimeoutCommandData = new SlashCommandBuilder()
  .setName('untimeout')
  .setDescription("Lève le timeout d'un membre")
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre concerné')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('raison')
      .setDescription('La raison de la levée du timeout')
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

@Injectable()
export class UntimeoutCommand implements Command {
  private readonly logger = new Logger(UntimeoutCommand.name);
  readonly data = untimeoutCommandData;

  constructor(private readonly auditService: AuditService) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { guild, member } = interaction;

    if (!guild || !(member instanceof GuildMember)) {
      await interaction.reply({
        content: 'Cette commande ne peut être utilisée que dans un serveur.',
        ephemeral: true,
      });
      return;
    }

    if (!hasPermission(member, PermissionFlagsBits.ModerateMembers)) {
      await interaction.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
        ephemeral: true,
      });
      return;
    }

    const targetUser = interaction.options.getUser('utilisateur', true);
    const reason =
      interaction.options.getString('raison') ?? 'Aucune raison fournie';

    const targetMember = await guild.members
      .fetch(targetUser.id)
      .catch(() => null);

    if (!targetMember) {
      await interaction.reply({
        content: "Ce membre n'est pas présent sur ce serveur.",
        ephemeral: true,
      });
      return;
    }

    if (!targetMember.communicationDisabledUntilTimestamp) {
      await interaction.reply({
        content: "Ce membre n'est pas actuellement en timeout",
        ephemeral: true,
      });
      return;
    }

    if (!canModerate(member, targetMember)) {
      await interaction.reply({
        content:
          'Vous ne pouvez pas lever le timeout de ce membre (rôle égal ou supérieur au vôtre).',
        ephemeral: true,
      });
      return;
    }

    await targetMember.timeout(null, reason);

    await this.auditService.record({
      guild,
      type: LogType.UNTIMEOUT,
      targetId: targetUser.id,
      authorId: member.id,
      reason,
    });

    await interaction.reply({
      content: `✅ Le timeout de **${targetUser.tag}** a été levé. Raison : ${reason}`,
      ephemeral: true,
    });

    this.logger.log(
      `Timeout de ${targetUser.tag} levé par ${member.user.tag} (${reason})`,
    );
  }
}
