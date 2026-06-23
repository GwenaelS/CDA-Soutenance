import { OnModuleInit, Injectable, Logger } from "@nestjs/common";
import { Client, GatewayIntentBits } from 'discord.js';
import { LogEntity } from "../entities/log.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class BotService implements OnModuleInit {
    private readonly logger = new Logger(BotService.name);
    private client: Client;

    private forbiddenWords = ['hack', 'scan', 'free-nitro', 'cheat'];
    
    constructor(
        @InjectRepository(LogEntity)
        private readonly logRepository: Repository<LogEntity>,
    ) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
    }

    async onModuleInit() {
        this.client.once('ready', () => {
            this.logger.log('Bot Wystrelia connecté : ${this.client.user?.tag');
        });
        this.client.on('messageCreate', async (message) => {
            if (message.author.bot || !message.guild) return;

            const contentLower = message.content.toLowerCase();

            const containsForbidden = this.forbiddenWords.some(word => contentLower.includes(word));

            if (containsForbidden) {
                try {
                    await message.delete();

                    const warning = await message.channel.send('${message.author}, votre message contenait un mot interdit et a été suppprimé.');
                    setTimeout(() => warning.delete().catch(() => {}), 5000);

                    await this.logRepository.save({
                        guild_id: message.guild.id,
                        user_id: message.author.id,
                        action: 'AUTOMOD_DELETE',
                        details: 'Message supprimé langage inadapté. Contenu : "${message.content}"'
                    });

                    this.logger.warn('Message de ${message.author.tagsupprimé (Mot interdit détecté). Log enregistré en Base de données') ;
                    return;
                } catch (error) {
                    this.logger.error('Erreur AutoMod: ${Error.message}');
                }
            }

            if (message.content.startsWith('!')) return;
             try {
                await this.logRepository.save({
                    guild_id: message.guild.id,
                    user_id: message.author.id,
                    action: 'XP_GAIN',
                    details: 'Gain de 15 XP pour acivité textuelle'
                });
                this.logger.log('+15 XP accordés à ${message.author.tag}(log enregitré)');
             } catch (error) {
                this.logger.error('Erreur XP: $error.message}');
             }
                });
            
        
         await this.client.login(process.env.DISCORD_TOKEN);
    }

    getClient(): Client {
        return this.client;
    }
}