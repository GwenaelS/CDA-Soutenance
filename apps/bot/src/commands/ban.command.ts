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

export const banCommandData = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bannit un utilisateur du serveur')
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription("L'utilisateur à bannir")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('raison')
      .setDescription('La raison du bannissement')
      .setRequired(false),
  )
  .addIntegerOption((option) =>
    option
      .setName('supprimer_messages')
      .setDescription('Nombre de jours de messages à supprimer (0-7)')
      .setMinValue(0)
      .setMaxValue(7)
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

@Injectable()
export class BanCommand implements Command {
  private readonly logger = new Logger(BanCommand.name);
  readonly data = banCommandData;

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

    if (!hasPermission(member, PermissionFlagsBits.BanMembers)) {
      await interaction.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
        ephemeral: true,
      });
      return;
    }

    const targetUser = interaction.options.getUser('utilisateur', true);
    const reason =
      interaction.options.getString('raison') ?? 'Aucune raison fournie';
    const deleteMessageDays =
      interaction.options.getInteger('supprimer_messages') ?? 0;

    // La cible peut ne plus être sur le serveur : on ne bloque que si elle y
    // est encore et que la hiérarchie des rôles l'interdit.
    const targetMember = await guild.members
      .fetch(targetUser.id)
      .catch(() => null);

    if (
      targetMember &&
      (!targetMember.bannable || !canModerate(member, targetMember))
    ) {
      await interaction.reply({
        content:
          'Vous ne pouvez pas bannir ce membre (rôle égal ou supérieur au vôtre, ou hiérarchie du bot insuffisante).',
        ephemeral: true,
      });
      return;
    }

    await guild.members.ban(targetUser.id, {
      deleteMessageSeconds: deleteMessageDays * 86400,
      reason,
    });

    await this.auditService.record({
      guild,
      type: LogType.BAN,
      targetId: targetUser.id,
      authorId: member.id,
      reason,
    });

    await interaction.reply({
      content: `✅ **${targetUser.tag}** a été banni. Raison : ${reason}`,
      ephemeral: true,
    });

    this.logger.log(
      `${targetUser.tag} banni par ${member.user.tag} (${reason})`,
    );
  }
}
