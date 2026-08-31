import { Injectable } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { MemberService } from 'src/utils/member.service';
import { Command } from './command.interface';

export const rankCommandData = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('Affiche votre XP, niveau et classement dans le serveur');

@Injectable()
export class RankCommand implements Command {
  readonly data = rankCommandData;

  constructor(private readonly memberService: MemberService) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { guild, user } = interaction;

    if (!guild) {
      await interaction.reply({
        content: 'Cette commande ne peut être utilisée que dans un serveur.',
        ephemeral: true,
      });
      return;
    }

    const memberRow = await this.memberService.find(guild.id, user.id);

    if (!memberRow) {
      const embed = new EmbedBuilder()
        .setTitle(`Rang de ${user.tag}`)
        .addFields(
          { name: 'Niveau', value: '0', inline: true },
          { name: 'XP', value: '0', inline: true },
          { name: 'Classement', value: 'Pas encore classé', inline: true },
        )
        .setColor(0x5865f2);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const higherCount = await this.memberService.countAbove(
      guild.id,
      memberRow.current_xp,
    );
    const totalCount = await this.memberService.count(guild.id);

    const embed = new EmbedBuilder()
      .setTitle(`Rang de ${user.tag}`)
      .addFields(
        { name: 'Niveau', value: `${memberRow.current_level}`, inline: true },
        { name: 'XP', value: `${memberRow.current_xp}`, inline: true },
        {
          name: 'Classement',
          value: `#${higherCount + 1} sur ${totalCount} membres`,
          inline: true,
        },
      )
      .setColor(0x5865f2);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
