import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

@Injectable()
export class BotService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(BotService.name);
  private readonly client: Client;

  constructor(private readonly config: ConfigService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
  }

  // Connexion
  async onApplicationBootstrap() {
    this.client.once(Events.ClientReady, (readyClient) => {
      this.logger.log(`Bot connecté en tant que ${readyClient.user.tag}`);
    });

    const token = this.config.get<string>('DISCORD_TOKEN');
    await this.client.login(token);
    this.client.user?.setStatus('dnd');

    this.client.user?.setPresence({
      status: 'dnd',
      activities: [{
        name: '/help | Private bot',
        type: 1
      }]
    });
  }

  // Deconnexion
  async onModuleDestroy() {
    await this.client.destroy();
  }

  // Get client
  getClient(): Client {
    return this.client;
  }
}
