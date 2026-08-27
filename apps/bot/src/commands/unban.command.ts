import { Injectable, Logger } from '@nestjs/common';
import { LogType } from '@wystrelia/shared';
import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { AuditService } from 'src/utils/audit.service';
import { hasPermission } from 'src/utils/permission-check';
import { Command } from './command.interface';

export const unbanCommandData = new SlashCommandBuilder()
  .setName('unban')
  .setDescription("Lève le bannissement d'un utilisateur")
  .addStringOption((option) =>
    option
      .setName('user_id')
      .setDescription("L'ID Discord de l'utilisateur banni")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('raison')
      .setDescription('La raison de la levée du bannissement')
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

@Injectable()
export class UnbanCommand implements Command {
  private readonly logger = new Logger(UnbanCommand.name);
  readonly data = unbanCommandData;

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

    const userId = interaction.options.getString('user_id', true);
    const reason =
      interaction.options.getString('raison') ?? 'Aucune raison fournie';

    const existingBan = await guild.bans.fetch(userId).catch(() => null);
    if (!existingBan) {
      await interaction.reply({
        content: "Cet utilisateur n'est pas banni",
        ephemeral: true,
      });
      return;
    }

    await guild.members.unban(userId, reason);

    await this.auditService.record({
      guild,
      type: LogType.UNBAN,
      targetId: userId,
      authorId: member.id,
      reason,
    });

    await interaction.reply({
      content: `✅ Le bannissement de **${existingBan.user.tag}** a été levé. Raison : ${reason}`,
      ephemeral: true,
    });

    this.logger.log(
      `Ban de ${existingBan.user.tag} levé par ${member.user.tag} (${reason})`,
    );
  }
}
