import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '@wystrelia/shared';
import { Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // Renvoie tous les membres d'un serveur
  async findAll(guildId: string): Promise<Member[]> {
    return this.memberRepository.find({
      where: { guild: { guild_id: guildId } },
      relations: ['guild'], // Requis par TypeORM pour joindre la table Guild
    });
  }

  // Renvoie un membre spécifique d'un serveur
  async findOne(guildId: string, discordUserId: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: {
        discord_user_id: discordUserId,
        guild: { guild_id: guildId },
      },
      relations: ['guild'],
    });

    if (!member) {
      throw new NotFoundException(
        `Membre avec l'ID ${discordUserId} introuvable sur le serveur ${guildId}`,
      );
    }

    return member;
  }
}