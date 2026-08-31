import { Injectable } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { MemberService } from 'src/utils/member.service';
import { hasPermission } from 'src/utils/permission-check';
import { Command } from './command.interface';

export const resetCommandData = new SlashCommandBuilder()
  .setName('reset')
  .setDescription("Réinitialise l'XP et le niveau d'un utilisateur")
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre concerné')
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

@Injectable()
export class ResetCommand implements Command {
  readonly data = resetCommandData;

  constructor(private readonly memberService: MemberService) {}

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

    const memberRow = await this.memberService.findOrCreate(
      guild.id,
      targetUser.id,
      new Date(),
    );

    // Aucun rôle de récompense n'est retiré automatiquement lors d'un reset.
    await this.memberService.updateXp(memberRow.id, 0, 0, null);

    await interaction.reply({
      content: `✅ XP et niveau de **${targetUser.tag}** réinitialisés.`,
      ephemeral: true,
    });
  }
}
