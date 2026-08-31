import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogType, Warning } from '@wystrelia/shared';
import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { AuditService } from 'src/utils/audit.service';
import { hasPermission } from 'src/utils/permission-check';
import { Repository } from 'typeorm';
import { Command } from './command.interface';

export const unwarnCommandData = new SlashCommandBuilder()
  .setName('unwarn')
  .setDescription("Retire un avertissement actif d'un membre")
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre concerné')
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName('warn_id')
      .setDescription("L'ID de l'avertissement à retirer")
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

@Injectable()
export class UnwarnCommand implements Command {
  private readonly logger = new Logger(UnwarnCommand.name);
  readonly data = unwarnCommandData;

  constructor(
    private readonly auditService: AuditService,
    @InjectRepository(Warning)
    private readonly warningRepository: Repository<Warning>,
  ) {}

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
    const warnId = interaction.options.getInteger('warn_id', true);

    const warning = await this.warningRepository.findOne({
      where: {
        id: warnId,
        is_active: true,
        member: {
          discord_user_id: targetUser.id,
          guild: { guild_id: guild.id },
        },
      },
    });

    if (!warning) {
      await interaction.reply({
        content: 'Aucun avertissement trouvé avec cet ID',
        ephemeral: true,
      });
      return;
    }

    warning.is_active = false;
    await this.warningRepository.save(warning);

    await this.auditService.record({
      guild,
      type: LogType.UNWARN,
      targetId: targetUser.id,
      authorId: member.id,
      reason: `Levée de l'avertissement #${warnId}`,
    });

    await interaction.reply({
      content: `✅ L'avertissement #${warnId} de **${targetUser.tag}** a été levé.`,
      ephemeral: true,
    });

    this.logger.log(
      `Avertissement #${warnId} de ${targetUser.tag} levé par ${member.user.tag}`,
    );
  }
}
