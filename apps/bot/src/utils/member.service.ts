import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild as GuildEntity, Member } from '@wystrelia/shared';
import { Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async find(guildId: string, discordUserId: string): Promise<Member | null> {
    return this.memberRepository.findOne({
      where: {
        guild: { guild_id: guildId },
        discord_user_id: discordUserId,
      },
    });
  }

  async findOrCreate(
    guildId: string,
    discordUserId: string,
    joinedAt: Date,
  ): Promise<Member> {
    const existing = await this.find(guildId, discordUserId);
    if (existing) return existing;

    return this.memberRepository.save(
      this.memberRepository.create({
        guild: { guild_id: guildId } as GuildEntity,
        discord_user_id: discordUserId,
        joined_at: joinedAt,
      }),
    );
  }

  async updateXp(
    memberId: number,
    xp: number,
    level: number,
    lastXpAt: Date | null,
  ): Promise<void> {
    await this.memberRepository.update(memberId, {
      current_xp: xp,
      current_level: level,
      last_xp_at: lastXpAt,
    });
  }

  async top(guildId: string, limit: number): Promise<Member[]> {
    return this.memberRepository.find({
      where: { guild: { guild_id: guildId } },
      order: { current_xp: 'DESC' },
      take: limit,
    });
  }

  async countAbove(guildId: string, xp: number): Promise<number> {
    return this.memberRepository
      .createQueryBuilder('member')
      .innerJoin('member.guild', 'guild')
      .where('guild.guild_id = :guildId', { guildId })
      .andWhere('member.current_xp > :xp', { xp })
      .getCount();
  }

  async count(guildId: string): Promise<number> {
    return this.memberRepository.count({
      where: { guild: { guild_id: guildId } },
    });
  }
}
