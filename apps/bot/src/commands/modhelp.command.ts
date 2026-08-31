import { Injectable } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from './command.interface';

export const modhelpCommandData = new SlashCommandBuilder()
  .setName('modhelp')
  .setDescription('Liste toutes les commandes de modération');

interface ModCommandDoc {
  syntax: string;
  description: string;
  permission: string;
}

const MOD_COMMANDS: ModCommandDoc[] = [
  {
    syntax: '/kick <utilisateur> [raison]',
    description: 'Expulse un membre du serveur',
    permission: 'Kick Members',
  },
  {
    syntax: '/ban <utilisateur> [raison] [supprimer_messages]',
    description: 'Bannit un utilisateur du serveur',
    permission: 'Ban Members',
  },
  {
    syntax: '/unban <user_id> [raison]',
    description: "Lève le bannissement d'un utilisateur",
    permission: 'Ban Members',
  },
  {
    syntax: '/timeout <utilisateur> <duree> [raison]',
    description: 'Applique un timeout de communication à un membre',
    permission: 'Moderate Members',
  },
  {
    syntax: '/untimeout <utilisateur> [raison]',
    description: "Lève le timeout d'un membre",
    permission: 'Moderate Members',
  },
  {
    syntax: '/warn <utilisateur> <raison>',
    description: 'Avertit un membre',
    permission: 'Moderate Members',
  },
  {
    syntax: '/unwarn <utilisateur> <warn_id>',
    description: "Retire un avertissement actif d'un membre",
    permission: 'Moderate Members',
  },
  {
    syntax: '/warnings <utilisateur>',
    description: "Liste les avertissements actifs d'un membre",
    permission: 'Moderate Members',
  },
  {
    syntax: '/userinfo [utilisateur]',
    description: "Affiche les informations d'un membre",
    permission: 'Aucune',
  },
  {
    syntax: '/lock [salon]',
    description: 'Verrouille un salon',
    permission: 'Manage Channels',
  },
  {
    syntax: '/unlock [salon]',
    description: 'Déverrouille un salon',
    permission: 'Manage Channels',
  },
  {
    syntax: '/clear [nombre]',
    description: 'Supprime plusieurs messages du salon courant',
    permission: 'Manage Messages',
  },
  {
    syntax: '/ping',
    description: 'Affiche la latence du bot',
    permission: 'Aucune',
  },
];

@Injectable()
export class ModhelpCommand implements Command {
  readonly data = modhelpCommandData;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setTitle('Commandes de modération')
      .setColor(0x5865f2)
      .addFields(
        MOD_COMMANDS.map((command) => ({
          name: command.syntax,
          value: `${command.description}\nPermission requise : *${command.permission}*`,
        })),
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
