import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from '@wystrelia/shared';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { MemberService } from 'src/utils/member.service';
import { Repository } from 'typeorm';
import { Command } from './command.interface';

export const userinfoCommandData = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription("Affiche les informations d'un membre")
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre à consulter (vous par défaut)')
      .setRequired(false),
  );

@Injectable()
export class UserinfoCommand implements Command {
  readonly data = userinfoCommandData;

  constructor(
    private readonly memberService: MemberService,
    @InjectRepository(Warning)
    private readonly warningRepository: Repository<Warning>,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { guild } = interaction;

    if (!guild) {
      await interaction.reply({
        content: 'Cette commande ne peut être utilisée que dans un serveur.',
        ephemeral: true,
      });
      return;
    }

    const targetUser =
      interaction.options.getUser('utilisateur') ?? interaction.user;

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

    const memberRow = await this.memberService.find(guild.id, targetUser.id);
    const activeWarningsCount = memberRow
      ? await this.warningRepository.count({
          where: { is_active: true, member: { id: memberRow.id } },
        })
      : 0;

    const roles = targetMember.roles.cache
      .filter((role) => role.id !== guild.id)
      .map((role) => `<@&${role.id}>`);

    const embed = new EmbedBuilder()
      .setTitle(targetUser.tag)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        {
          name: 'Arrivé le',
          value: targetMember.joinedAt
            ? `<t:${Math.floor(targetMember.joinedAt.getTime() / 1000)}:f>`
            : 'Inconnu',
        },
        {
          name: 'Rôles',
          value: roles.length > 0 ? roles.join(', ') : 'Aucun',
        },
        {
          name: 'Niveau',
          value: `${memberRow?.current_level ?? 0}`,
          inline: true,
        },
        {
          name: 'XP',
          value: `${memberRow?.current_xp ?? 0}`,
          inline: true,
        },
        {
          name: 'Avertissements actifs',
          value: `${activeWarningsCount}`,
          inline: true,
        },
      )
      .setColor(0x5865f2);

    await interaction.reply({ embeds: [embed] });
  }
}
