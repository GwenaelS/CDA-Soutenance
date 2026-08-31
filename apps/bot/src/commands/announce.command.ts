import { Injectable } from '@nestjs/common';
import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { hasPermission } from 'src/utils/permission-check';
import { Command } from './command.interface';

const DEFAULT_COLOR = 0x5865f2;
const HEX_COLOR_PATTERN = /^#?[0-9a-fA-F]{6}$/;

export const announceCommandData = new SlashCommandBuilder()
  .setName('announce')
  .setDescription("Envoie une annonce sous forme d'embed dans un salon")
  .addStringOption((option) =>
    option
      .setName('titre')
      .setDescription("Titre de l'annonce")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription("Contenu de l'annonce")
      .setRequired(true),
  )
  .addChannelOption((option) =>
    option
      .setName('salon')
      .setDescription('Salon de destination')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('couleur')
      .setDescription("Couleur hex de l'embed (ex: #5865F2)")
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

@Injectable()
export class AnnounceCommand implements Command {
  readonly data = announceCommandData;

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

    const title = interaction.options.getString('titre', true);
    const description = interaction.options.getString('description', true);
    const colorInput = interaction.options.getString('couleur');
    const channel = interaction.options.getChannel('salon', true, [
      ChannelType.GuildText,
    ]);

    let color = DEFAULT_COLOR;
    if (colorInput) {
      if (!HEX_COLOR_PATTERN.test(colorInput)) {
        await interaction.reply({
          content:
            'Couleur invalide : utilisez un format hexadécimal (ex: #5865F2).',
          ephemeral: true,
        });
        return;
      }
      color = parseInt(colorInput.replace('#', ''), 16);
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    await interaction.reply({
      content: `✅ Annonce envoyée dans <#${channel.id}>.`,
      ephemeral: true,
    });
  }
}
