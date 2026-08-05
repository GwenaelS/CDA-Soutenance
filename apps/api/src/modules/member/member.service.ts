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

  // Return all members of a guild
  findAll(guildId: string): Promise<Member[]> {
    return this.memberRepository.find({
      where: { guild: { guild_id: guildId } },
    });
  }

  // Return a single member of a guild
  async findOne(guildId: string, discordUserId: string): Promise<Member> {
    const member = await this.memberRepository.findOneBy({
      discord_user_id: discordUserId,
      guild: { guild_id: guildId },
    });
    if (!member) {
      throw new NotFoundException(`Member ${discordUserId} not found`);
    }
    return member;
  }
}
