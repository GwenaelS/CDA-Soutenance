import { Injectable, Logger } from '@nestjs/common';
import { LogType } from '@wystrelia/shared';
import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { AuditService } from 'src/utils/audit.service';
import { hasPermission } from 'src/utils/permission-check';
import { Command } from './command.interface';

export const unlockCommandData = new SlashCommandBuilder()
  .setName('unlock')
  .setDescription('Déverrouille un salon (rétablit SendMessages à @everyone)')
  .addChannelOption((option) =>
    option
      .setName('salon')
      .setDescription('Le salon à déverrouiller (courant par défaut)')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

@Injectable()
export class UnlockCommand implements Command {
  private readonly logger = new Logger(UnlockCommand.name);
  readonly data = unlockCommandData;

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

    if (!hasPermission(member, PermissionFlagsBits.ManageChannels)) {
      await interaction.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
        ephemeral: true,
      });
      return;
    }

    const channel =
      interaction.options.getChannel('salon', false, [ChannelType.GuildText]) ??
      interaction.channel;

    if (!channel || channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: 'Salon invalide : un salon textuel est requis.',
        ephemeral: true,
      });
      return;
    }

    const everyoneOverwrite = channel.permissionOverwrites.cache.get(guild.id);
    if (!everyoneOverwrite?.deny.has(PermissionFlagsBits.SendMessages)) {
      await interaction.reply({
        content: "Ce salon n'est pas verrouillé",
        ephemeral: true,
      });
      return;
    }

    await channel.permissionOverwrites.edit(guild.roles.everyone, {
      SendMessages: null,
    });

    await this.auditService.record({
      guild,
      type: LogType.UNLOCK,
      targetId: channel.id,
      authorId: member.id,
      reason: 'Déverrouillage du salon',
    });

    await interaction.reply(`🔓 Le salon <#${channel.id}> a été déverrouillé.`);

    this.logger.log(`Salon ${channel.id} déverrouillé par ${member.user.tag}`);
  }
}
