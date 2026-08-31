import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from '@wystrelia/shared';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { hasPermission } from 'src/utils/permission-check';
import { Repository } from 'typeorm';
import { Command } from './command.interface';

export const warningsCommandData = new SlashCommandBuilder()
  .setName('warnings')
  .setDescription("Liste les avertissements actifs d'un membre")
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre concerné')
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

@Injectable()
export class WarningsCommand implements Command {
  readonly data = warningsCommandData;

  constructor(
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

    const warnings = await this.warningRepository.find({
      where: {
        is_active: true,
        member: {
          discord_user_id: targetUser.id,
          guild: { guild_id: guild.id },
        },
      },
      order: { time: 'ASC' },
    });

    if (warnings.length === 0) {
      await interaction.reply({
        content: "Cet utilisateur n'a aucun avertissement actif",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Avertissements actifs de ${targetUser.tag}`)
      .setColor(0xfee75c)
      .addFields(
        warnings.map((warning) => ({
          name: `#${warning.id}`,
          value: `Raison : ${warning.reason}\nModérateur : <@${warning.author_id}>\nDate : <t:${Math.floor(warning.time.getTime() / 1000)}:f>`,
        })),
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
