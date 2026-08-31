import { Injectable } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { LevelService } from 'src/utils/level.service';
import { MemberService } from 'src/utils/member.service';
import { hasPermission } from 'src/utils/permission-check';
import { Command } from './command.interface';

export const addlevelsCommandData = new SlashCommandBuilder()
  .setName('addlevels')
  .setDescription('Ajoute des niveaux à un utilisateur')
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre concerné')
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName('niveaux')
      .setDescription('Nombre de niveaux à ajouter')
      .setMinValue(1)
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

@Injectable()
export class AddlevelsCommand implements Command {
  readonly data = addlevelsCommandData;

  constructor(
    private readonly levelService: LevelService,
    private readonly memberService: MemberService,
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

    if (!hasPermission(member, PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
        ephemeral: true,
      });
      return;
    }

    const targetUser = interaction.options.getUser('utilisateur', true);
    const levelsToAdd = interaction.options.getInteger('niveaux', true);

    const settings = await this.levelService.getSettings(guild.id);
    const targetMember = await guild.members
      .fetch(targetUser.id)
      .catch(() => null);

    const memberRow = await this.memberService.findOrCreate(
      guild.id,
      targetUser.id,
      targetMember?.joinedAt ?? new Date(),
    );

    const oldLevel = memberRow.current_level;
    const newLevel = Math.min(oldLevel + levelsToAdd, settings.maxLevel);
    const newXp = this.levelService.xpForLevel(newLevel);

    await this.memberService.updateXp(
      memberRow.id,
      newXp,
      newLevel,
      memberRow.last_xp_at,
    );

    if (newLevel !== oldLevel && targetMember) {
      await this.levelService.applyLevelRewards(
        targetMember,
        guild.id,
        oldLevel,
        newLevel,
      );
    }

    await interaction.reply({
      content: `✅ **${targetUser.tag}** passe au niveau ${newLevel} (+${levelsToAdd}).`,
      ephemeral: true,
    });
  }
}
