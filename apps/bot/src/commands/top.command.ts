import { Injectable } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { MemberService } from 'src/utils/member.service';
import { Command } from './command.interface';

export const topCommandData = new SlashCommandBuilder()
  .setName('top')
  .setDescription('Affiche les 10 premiers membres par XP');

@Injectable()
export class TopCommand implements Command {
  readonly data = topCommandData;

  constructor(private readonly memberService: MemberService) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { guild } = interaction;

    if (!guild) {
      await interaction.reply({
        content: 'Cette commande ne peut être utilisée que dans un serveur.',
        ephemeral: true,
      });
      return;
    }

    const topMembers = await this.memberService.top(guild.id, 10);

    if (topMembers.length === 0) {
      await interaction.reply({
        content: "Aucun membre n'a encore gagné d'XP.",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Classement de ${guild.name}`)
      .setColor(0x5865f2)
      .setDescription(
        topMembers
          .map(
            (member, index) =>
              `**#${index + 1}** <@${member.discord_user_id}> — Niveau ${member.current_level}, ${member.current_xp} XP`,
          )
          .join('\n'),
      );

    await interaction.reply({ embeds: [embed] });
  }
}
