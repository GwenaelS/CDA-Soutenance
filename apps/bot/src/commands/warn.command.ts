import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogType, Warning } from '@wystrelia/shared';
import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { AuditService } from 'src/utils/audit.service';
import { MemberService } from 'src/utils/member.service';
import { hasPermission } from 'src/utils/permission-check';
import { Repository } from 'typeorm';
import { Command } from './command.interface';

export const warnCommandData = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Avertit un membre')
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Le membre à avertir')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('raison')
      .setDescription("La raison de l'avertissement")
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

@Injectable()
export class WarnCommand implements Command {
  private readonly logger = new Logger(WarnCommand.name);
  readonly data = warnCommandData;

  constructor(
    private readonly auditService: AuditService,
    private readonly memberService: MemberService,
    @InjectRepository(Warning)
    private readonly warningRepository: Repository<Warning>,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { guild, member } = interaction;

    if (!guild || !(member instanceof GuildMember)) {
      await interaction.reply({
        content: 'Cette commande ne peut être utilisée que dans un serveur.',
        ephemeral: true,
      });
      return;
    }

    if (!hasPermission(member, PermissionFlagsBits.ModerateMembers)) {
      await interaction.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
        ephemeral: true,
      });
      return;
    }

    const targetUser = interaction.options.getUser('utilisateur', true);
    const reason = interaction.options.getString('raison', true);

    const targetMember = await guild.members
      .fetch(targetUser.id)
      .catch(() => null);
    const joinedAt = targetMember?.joinedAt ?? new Date();

    const memberRow = await this.memberService.findOrCreate(
      guild.id,
      targetUser.id,
      joinedAt,
    );

    await this.warningRepository.save(
      this.warningRepository.create({
        member: memberRow,
        author_id: member.id,
        reason,
        time: new Date(),
        is_active: true,
      }),
    );

    await this.auditService.record({
      guild,
      type: LogType.WARN,
      targetId: targetUser.id,
      authorId: member.id,
      reason,
    });

    let dmStatus = 'Un DM a été envoyé à la cible.';
    try {
      await targetUser.send(
        `Vous avez reçu un avertissement sur **${guild.name}**. Raison : ${reason}`,
      );
    } catch {
      dmStatus = "Le DM n'a pas pu être délivré (messages privés désactivés).";
    }

    await interaction.reply({
      content: `⚠️ **${targetUser.tag}** a été averti. ${dmStatus}`,
      ephemeral: true,
    });

    this.logger.log(
      `${targetUser.tag} averti par ${member.user.tag} (${reason})`,
    );
  }
}
