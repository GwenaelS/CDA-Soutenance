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

export const kickCommandData = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Expulse un membre du serveur')
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre à expulser')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('raison')
      .setDescription("La raison de l'expulsion")
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

@Injectable()
export class KickCommand implements Command {
  private readonly logger = new Logger(KickCommand.name);
  readonly data = kickCommandData;

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

    if (!hasPermission(member, PermissionFlagsBits.KickMembers)) {
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

    if (!targetMember.kickable || !canModerate(member, targetMember)) {
      await interaction.reply({
        content:
          'Vous ne pouvez pas expulser ce membre (rôle égal ou supérieur au vôtre, ou hiérarchie du bot insuffisante).',
        ephemeral: true,
      });
      return;
    }

    await targetMember.kick(reason);

    await this.auditService.record({
      guild,
      type: LogType.KICK,
      targetId: targetUser.id,
      authorId: member.id,
      reason,
    });

    await interaction.reply({
      content: `✅ **${targetUser.tag}** a été expulsé. Raison : ${reason}`,
      ephemeral: true,
    });

    this.logger.log(
      `${targetUser.tag} expulsé par ${member.user.tag} (${reason})`,
    );
  }
}
