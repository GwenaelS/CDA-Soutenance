import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Birthday, Guild_config } from '@wystrelia/shared';
import { EmbedBuilder } from 'discord.js';
import { BotService } from 'src/discord/bot.service';
import { Repository } from 'typeorm';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class BirthdayCronService implements OnModuleInit {
  private readonly logger = new Logger(BirthdayCronService.name);

  constructor(
    private readonly bot: BotService,
    @InjectRepository(Birthday)
    private readonly birthdayRepository: Repository<Birthday>,
    @InjectRepository(Guild_config)
    private readonly guildConfigRepository: Repository<Guild_config>,
  ) {}

  onModuleInit() {
    this.scheduleNextRun();
  }

  private scheduleNextRun(): void {
    const now = new Date();
    const nextMidnightUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
    );
    const delay = nextMidnightUtc - now.getTime();

    setTimeout(() => {
      this.runCheck();
      setInterval(() => this.runCheck(), ONE_DAY_MS);
    }, delay);

    this.logger.log(
      `Prochaine vérification des anniversaires dans ${Math.round(delay / 60000)} min`,
    );
  }

  private runCheck(): void {
    this.checkBirthdays().catch((err) =>
      this.logger.error('Erreur dans le cron anniversaires', err),
    );
  }

  private async checkBirthdays(): Promise<void> {
    const now = new Date();
    const birthdays = await this.birthdayRepository
      .createQueryBuilder('birthday')
      .innerJoinAndSelect('birthday.member', 'member')
      .innerJoinAndSelect('member.guild', 'guild')
      .where('MONTH(birthday.datetime) = :month', {
        month: now.getUTCMonth() + 1,
      })
      .andWhere('DAY(birthday.datetime) = :day', { day: now.getUTCDate() })
      .andWhere(
        '(birthday.date_post IS NULL OR YEAR(birthday.date_post) != :year)',
        { year: now.getUTCFullYear() },
      )
      .getMany();

    for (const birthday of birthdays) {
      await this.announceBirthday(birthday).catch((err) =>
        this.logger.error(
          `Erreur en annonçant l'anniversaire #${birthday.id}`,
          err,
        ),
      );
    }
  }

  private async announceBirthday(birthday: Birthday): Promise<void> {
    const guildId = birthday.member.guild.guild_id;

    const config = await this.guildConfigRepository.findOne({
      where: { guild: { guild_id: guildId } },
    });
    if (!config?.birthday_channel_id) return;

    const guild = await this.bot
      .getClient()
      .guilds.fetch(guildId)
      .catch(() => null);
    if (!guild) return;

    const channel = await guild.channels
      .fetch(config.birthday_channel_id)
      .catch(() => null);
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle('🎂 Joyeux anniversaire !')
      .setDescription(
        `Toute l'équipe souhaite un joyeux anniversaire à <@${birthday.member.discord_user_id}> !`,
      )
      .setColor(0xffd966);

    await channel
      .send({ embeds: [embed] })
      .catch((err) =>
        this.logger.error("Impossible de poster l'annonce d'anniversaire", err),
      );

    birthday.date_post = new Date();
    await this.birthdayRepository.save(birthday);
  }
}
