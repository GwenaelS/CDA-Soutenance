import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { addlevelsCommandData } from './commands/addlevels.command';
import { addxpCommandData } from './commands/addxp.command';
import { announceCommandData } from './commands/announce.command';
import { banCommandData } from './commands/ban.command';
import { clearCommandData } from './commands/clear.command';
import { kickCommandData } from './commands/kick.command';
import { lockCommandData } from './commands/lock.command';
import { modhelpCommandData } from './commands/modhelp.command';
import { pingCommandData } from './commands/ping.command';
import { rankCommandData } from './commands/rank.command';
import { resetCommandData } from './commands/reset.command';
import { setlevelsCommandData } from './commands/setlevels.command';
import { setxpCommandData } from './commands/setxp.command';
import { timeoutCommandData } from './commands/timeout.command';
import { topCommandData } from './commands/top.command';
import { unbanCommandData } from './commands/unban.command';
import { unlockCommandData } from './commands/unlock.command';
import { untimeoutCommandData } from './commands/untimeout.command';
import { unwarnCommandData } from './commands/unwarn.command';
import { userinfoCommandData } from './commands/userinfo.command';
import { warnCommandData } from './commands/warn.command';
import { warningsCommandData } from './commands/warnings.command';

const commandsData = [
  pingCommandData,
  kickCommandData,
  banCommandData,
  unbanCommandData,
  timeoutCommandData,
  untimeoutCommandData,
  warnCommandData,
  unwarnCommandData,
  warningsCommandData,
  userinfoCommandData,
  lockCommandData,
  unlockCommandData,
  clearCommandData,
  modhelpCommandData,
  rankCommandData,
  topCommandData,
  addxpCommandData,
  setxpCommandData,
  addlevelsCommandData,
  setlevelsCommandData,
  resetCommandData,
  announceCommandData,
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
