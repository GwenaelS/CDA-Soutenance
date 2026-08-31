import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Automatic_role, Guild_config } from '@wystrelia/shared';
import { EmbedBuilder, Events, GuildMember } from 'discord.js';
import { BotService } from 'src/discord/bot.service';
import { MemberService } from 'src/utils/member.service';
import { Repository } from 'typeorm';

@Injectable()
export class GuildMemberListener implements OnModuleInit {
  private readonly logger = new Logger(GuildMemberListener.name);

  constructor(
    private readonly bot: BotService,
    private readonly memberService: MemberService,
    @InjectRepository(Automatic_role)
    private readonly automaticRoleRepository: Repository<Automatic_role>,
    @InjectRepository(Guild_config)
    private readonly guildConfigRepository: Repository<Guild_config>,
  ) {}

  onModuleInit() {
    const client = this.bot.getClient();

    client.on(Events.GuildMemberAdd, (member) => {
      this.handleMemberAdd(member).catch((err) =>
        this.logger.error('Erreur dans guildMemberAdd', err),
      );
    });

    client.on(Events.GuildMemberRemove, (member) => {
      this.logger.log(
        `${member.user?.tag ?? member.id} a quitté ${member.guild.name}`,
      );
    });
  }

  private async handleMemberAdd(member: GuildMember): Promise<void> {
    const guildId = member.guild.id;

    // Historique conservé même après un départ (RG-25) : on garde le
    // Member existant s'il y en a déjà un, sinon on en crée un.
    await this.memberService.findOrCreate(
      guildId,
      member.id,
      member.joinedAt ?? new Date(),
    );

    const autoRoles = await this.automaticRoleRepository.find({
      where: { guild: { guild_id: guildId } },
    });
    for (const autoRole of autoRoles) {
      await member.roles
        .add(autoRole.role_id)
        .catch((err) =>
          this.logger.warn(
            `Impossible d'assigner le rôle automatique ${autoRole.role_id} à ${member.id}`,
            err,
          ),
        );
    }

    const config = await this.guildConfigRepository.findOne({
      where: { guild: { guild_id: guildId } },
    });
    if (!config?.welcome_channel_id) return;

    const channel = await member.guild.channels
      .fetch(config.welcome_channel_id)
      .catch(() => null);
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle(`Bienvenue sur ${member.guild.name} !`)
      .setDescription(`<@${member.id}> vient de rejoindre le serveur.`)
      .setThumbnail(member.user.displayAvatarURL())
      .setColor(0x57f287)
      .setTimestamp();

    await channel
      .send({ embeds: [embed] })
      .catch((err) =>
        this.logger.error("Impossible d'envoyer le message de bienvenue", err),
      );
  }
}
