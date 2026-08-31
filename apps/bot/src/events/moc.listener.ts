import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moc_channel } from '@wystrelia/shared';
import { Events, Message } from 'discord.js';
import { BotService } from 'src/discord/bot.service';
import { Repository } from 'typeorm';

const LINK_PATTERN = /https?:\/\//i;

@Injectable()
export class MocListener implements OnModuleInit {
  private readonly logger = new Logger(MocListener.name);

  constructor(
    private readonly bot: BotService,
    @InjectRepository(Moc_channel)
    private readonly mocChannelRepository: Repository<Moc_channel>,
  ) {}

  onModuleInit() {
    const client = this.bot.getClient();
    client.on(Events.MessageCreate, (message) => {
      this.handleMessage(message).catch((err) =>
        this.logger.error('Erreur dans moc', err),
      );
    });
  }

  private async handleMessage(message: Message): Promise<void> {
    if (message.author.bot) return;
    if (!message.guild) return;

    const mocChannel = await this.mocChannelRepository.findOne({
      where: {
        moc_channel_id: message.channelId,
        guild: { guild_id: message.guild.id },
      },
    });
    if (!mocChannel) return;

    const violation = this.findViolation(message, mocChannel);
    if (!violation) return;

    await message.delete().catch(() => undefined);

    await message.author
      .send(
        `Votre message dans <#${message.channelId}> sur **${message.guild.name}** a été supprimé : ${violation}`,
      )
      .catch(() => undefined);

    this.logger.log(
      `Message MOC non conforme supprimé (${message.author.tag}) : ${violation}`,
    );
  }

  private findViolation(
    message: Message,
    mocChannel: Moc_channel,
  ): string | null {
    const hasImage =
      message.attachments.some((a) => a.contentType?.startsWith('image/')) ||
      message.embeds.some((e) => !!e.image);
    const hasVideo =
      message.attachments.some((a) => a.contentType?.startsWith('video/')) ||
      message.embeds.some((e) => !!e.video);
    const hasFile = message.attachments.some(
      (a) =>
        !a.contentType?.startsWith('image/') &&
        !a.contentType?.startsWith('video/'),
    );
    const hasLink = LINK_PATTERN.test(message.content);
    const textOnly = message.content.replace(/https?:\/\/\S+/gi, '').trim();
    const hasText = textOnly.length > 0;
    const hasAnyMedia = hasImage || hasVideo || hasFile || hasLink;

    if (hasImage && !mocChannel.allow_images) {
      return 'les images ne sont pas autorisées dans ce salon.';
    }
    if (hasVideo && !mocChannel.allow_videos) {
      return 'les vidéos ne sont pas autorisées dans ce salon.';
    }
    if (hasFile && !mocChannel.allow_files) {
      return 'les fichiers ne sont pas autorisés dans ce salon.';
    }
    if (hasLink && !mocChannel.allow_links) {
      return 'les liens ne sont pas autorisés dans ce salon.';
    }
    if (!hasAnyMedia && hasText && !mocChannel.allow_text) {
      return "le texte seul n'est pas autorisé dans ce salon.";
    }

    return null;
  }
}
