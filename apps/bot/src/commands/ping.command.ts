import { Injectable } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from './command.interface';

export const pingCommandData = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Affiche la latence du bot');

@Injectable()
export class PingCommand implements Command {
  readonly data = pingCommandData;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sent = await interaction.reply({
      content: 'Ping...',
      ephemeral: true,
      fetchReply: true,
    });

    const apiLatency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatency = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong !')
      .addFields(
        { name: 'Latence WebSocket', value: `${wsLatency} ms`, inline: true },
        {
          name: 'Latence API Discord',
          value: `${apiLatency} ms`,
          inline: true,
        },
      )
      .setColor(0x57f287);

    await interaction.editReply({ content: '', embeds: [embed] });
  }
}
