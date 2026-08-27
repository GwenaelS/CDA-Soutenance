import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { banCommandData } from './commands/ban.command';
import { kickCommandData } from './commands/kick.command';
import { pingCommandData } from './commands/ping.command';
import { timeoutCommandData } from './commands/timeout.command';
import { unbanCommandData } from './commands/unban.command';

const commandsData = [
  pingCommandData,
  kickCommandData,
  banCommandData,
  unbanCommandData,
  timeoutCommandData,
].map((command) => command.toJSON());

async function deployCommands() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!token || !clientId) {
    console.error(
      'DISCORD_TOKEN et DISCORD_CLIENT_ID sont requis pour déployer les commandes.',
    );
    process.exit(1);
  }

  const rest = new REST().setToken(token);

  try {
    if (guildId) {
      // Dev : enregistrement instantané limité à un serveur
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commandsData,
      });
      console.log(
        `${commandsData.length} commande(s) déployée(s) sur le serveur ${guildId}.`,
      );
    } else {
      // Prod : enregistrement global (propagation jusqu'à 1h)
      await rest.put(Routes.applicationCommands(clientId), {
        body: commandsData,
      });
      console.log(
        `${commandsData.length} commande(s) déployée(s) globalement.`,
      );
    }
  } catch (err) {
    console.error('Échec du déploiement des commandes :', err);
    process.exit(1);
  }
}

void deployCommands();
