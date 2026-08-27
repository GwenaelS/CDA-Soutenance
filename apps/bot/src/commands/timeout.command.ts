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

const MAX_TIMEOUT_MINUTES = 40320; // 28 jours, limite Discord

export const timeoutCommandData = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('Applique un timeout de communication à un membre')
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre à mettre en timeout')
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName('duree')
      .setDescription('Durée du timeout en minutes (1-40320)')
      .setMinValue(1)
      .setMaxValue(MAX_TIMEOUT_MINUTES)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('raison')
      .setDescription('La raison du timeout')
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

@Injectable()
export class TimeoutCommand implements Command {
  private readonly logger = new Logger(TimeoutCommand.name);
  readonly data = timeoutCommandData;

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
    const minutes = interaction.options.getInteger('duree', true);
    const reason =
      interaction.options.getString('raison') ?? 'Aucune raison fournie';

    if (minutes < 1 || minutes > MAX_TIMEOUT_MINUTES) {
      await interaction.reply({
        content: `La durée doit être comprise entre 1 et ${MAX_TIMEOUT_MINUTES} minutes.`,
        ephemeral: true,
      });
      return;
    }

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

    if (!targetMember.moderatable || !canModerate(member, targetMember)) {
      await interaction.reply({
        content:
          'Vous ne pouvez pas mettre ce membre en timeout (rôle égal ou supérieur au vôtre, ou hiérarchie du bot insuffisante).',
        ephemeral: true,
      });
      return;
    }

    const durationMs = minutes * 60 * 1000;
    await targetMember.timeout(durationMs, reason);
    const expireAt = new Date(Date.now() + durationMs);

    await this.auditService.record({
      guild,
      type: LogType.TIMEOUT,
      targetId: targetUser.id,
      authorId: member.id,
      reason,
      duration: minutes,
      expireAt,
    });

    await interaction.reply({
      content: `✅ **${targetUser.tag}** est en timeout pour ${minutes} minute(s). Raison : ${reason}`,
      ephemeral: true,
    });

    this.logger.log(
      `${targetUser.tag} mis en timeout par ${member.user.tag} pour ${minutes} min (${reason})`,
    );
  }
}
