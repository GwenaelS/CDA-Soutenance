import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exempted_role, Filtered_word, LogType } from '@wystrelia/shared';
import { Events, Message } from 'discord.js';
import { BotService } from 'src/discord/bot.service';
import { AuditService } from 'src/utils/audit.service';
import { Repository } from 'typeorm';

const SPAM_MESSAGE_LIMIT = 5;
const SPAM_WINDOW_MS = 5000;
const SPAM_MENTION_LIMIT = 5;
const AUTO_MUTE_DURATION_MINUTES = 60; // RG-13, valeur par défaut
const LINK_PATTERN = /https?:\/\/|www\./i;
const INVITE_PATTERN = /discord\.gg\/|discord\.com\/invite\//i;

@Injectable()
export class MessageCreateListener implements OnModuleInit {
  private readonly logger = new Logger(MessageCreateListener.name);
  // Clé `${guildId}:${channelId}:${userId}` -> timestamps des derniers messages
  private readonly recentMessages = new Map<string, number[]>();

  constructor(
    private readonly bot: BotService,
    private readonly auditService: AuditService,
    @InjectRepository(Filtered_word)
    private readonly filteredWord: Repository<Filtered_word>,
    @InjectRepository(Exempted_role)
    private readonly exemptedRole: Repository<Exempted_role>,
  ) {}

  onModuleInit() {
    const client = this.bot.getClient();
    client.on(Events.MessageCreate, (message) => {
      this.handleMessage(message).catch((err) =>
        this.logger.error('Erreur dans messageCreate', err),
      );
    });
  }

  private async handleMessage(message: Message): Promise<void> {
    // 1. Ignore les bots et les messages privé (hors serveur / MP)
    if (message.author.bot) return;
    if (!message.guild) return;

    const guildId = message.guildId;
    if (!guildId) return;

    // 2. Auteur du message est-il exempté ?
    const exempted = await this.exemptedRole.find({
      where: { guild: { guild_id: guildId } },
    });
    const exemptedRoleIds = exempted.map((e) => e.role_id);

    const member = message.member;
    if (
      member &&
      member.roles.cache.some((role) => exemptedRoleIds.includes(role.id))
    ) {
      return;
    }

    // 3. Mots interdits
    if (await this.checkBannedWords(message, guildId)) return;

    // 4. Spam (volume de messages ou mentions) — RG-08/RG-09
    if (await this.checkSpam(message, guildId)) return;

    // 5. Liens — RG-06
    if (LINK_PATTERN.test(message.content)) {
      await this.deleteAndLog(
        message,
        'Lien détecté',
        `Message supprimé (contenait un lien)`,
      );
      return;
    }

    // 6. Invitations Discord — RG-07
    if (INVITE_PATTERN.test(message.content)) {
      await this.deleteAndLog(
        message,
        'Invitation Discord détectée',
        `Message supprimé (contenait une invitation Discord)`,
      );
    }
  }

  private async checkBannedWords(
    message: Message,
    guildId: string,
  ): Promise<boolean> {
    const filtered = await this.filteredWord.find({
      where: { guild: { guild_id: guildId } },
    });
    if (filtered.length === 0) return false;

    const content = message.content.toLowerCase();
    const found = filtered.find((fw) =>
      content.includes(fw.word.toLowerCase()),
    );
    if (!found) return false;

    await message.delete().catch(() => undefined);
    this.logger.log(
      `Message de ${message.author.tag} supprimé (mot interdit : ${found.word})`,
    );

    await this.auditService.postSimpleEmbed(
      message.guild!,
      'Mot interdit détecté',
      [
        { name: 'Auteur', value: `<@${message.author.id}>`, inline: true },
        { name: 'Salon', value: `<#${message.channelId}>`, inline: true },
        { name: 'Mot déclenché', value: maskWord(found.word) },
      ],
    );

    return true;
  }

  private async checkSpam(message: Message, guildId: string): Promise<boolean> {
    const key = `${guildId}:${message.channelId}:${message.author.id}`;
    const now = Date.now();
    const timestamps = (this.recentMessages.get(key) ?? []).filter(
      (t) => now - t < SPAM_WINDOW_MS,
    );
    timestamps.push(now);
    this.recentMessages.set(key, timestamps);

    const mentionCount =
      message.mentions.users.size +
      message.mentions.roles.size +
      (message.mentions.everyone ? 1 : 0);

    const isVolumeSpam = timestamps.length > SPAM_MESSAGE_LIMIT;
    const isMentionSpam = mentionCount >= SPAM_MENTION_LIMIT;

    if (!isVolumeSpam && !isMentionSpam) return false;

    await message.delete().catch(() => undefined);

    const targetMember = message.member;
    if (targetMember?.moderatable) {
      await targetMember
        .timeout(
          AUTO_MUTE_DURATION_MINUTES * 60 * 1000,
          isVolumeSpam ? 'Spam (volume de messages)' : 'Spam (mentions)',
        )
        .catch((err) =>
          this.logger.warn(
            `Impossible de mute automatiquement ${message.author.tag}`,
            err,
          ),
        );

      // RG-09 : jamais de WARNING créé automatiquement, uniquement le mute + le log.
      await this.auditService.record({
        guild: message.guild!,
        type: LogType.TIMEOUT,
        targetId: message.author.id,
        authorId: null,
        reason: isVolumeSpam
          ? `Auto-modération : spam (>${SPAM_MESSAGE_LIMIT} messages / ${SPAM_WINDOW_MS / 1000}s)`
          : `Auto-modération : spam (${mentionCount} mentions)`,
        duration: AUTO_MUTE_DURATION_MINUTES,
        expireAt: new Date(now + AUTO_MUTE_DURATION_MINUTES * 60 * 1000),
      });
    }

    this.recentMessages.delete(key);
    return true;
  }

  private async deleteAndLog(
    message: Message,
    title: string,
    logMessage: string,
  ): Promise<void> {
    await message.delete().catch(() => undefined);
    this.logger.log(`${logMessage} (${message.author.tag})`);

    await this.auditService.postSimpleEmbed(message.guild!, title, [
      { name: 'Auteur', value: `<@${message.author.id}>`, inline: true },
      { name: 'Salon', value: `<#${message.channelId}>`, inline: true },
    ]);
  }
}

function maskWord(word: string): string {
  if (word.length <= 1) return word;
  return `${word[0]}${'*'.repeat(word.length - 1)}`;
}
