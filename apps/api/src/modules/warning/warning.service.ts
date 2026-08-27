import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, Warning } from '@wystrelia/shared';
import { Repository } from 'typeorm';
import { CreateWarningDto } from './dto/create-warning.dto';

@Injectable()
export class WarningService {
  constructor(
    @InjectRepository(Warning)
    private readonly warningRepository: Repository<Warning>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  findAll(guildId: string, discordUserId: string): Promise<Warning[]> {
    return this.warningRepository.find({
      where: {
        member: {
          guild: { guild_id: guildId },
          discord_user_id: discordUserId,
        },
      },
      order: { time: 'DESC' },
    });
  }

  async findOne(
    guildId: string,
    discordUserId: string,
    id: number,
  ): Promise<Warning> {
    const warning = await this.warningRepository.findOneBy({
      id,
      member: { guild: { guild_id: guildId }, discord_user_id: discordUserId },
    });
    if (!warning) {
      throw new NotFoundException(`Warning ${id} not found`);
    }
    return warning;
  }

  async create(
    guildId: string,
    discordUserId: string,
    authorId: string,
    dto: CreateWarningDto,
  ): Promise<Warning> {
    const member = await this.memberRepository.findOneBy({
      discord_user_id: discordUserId,
      guild: { guild_id: guildId },
    });
    if (!member) {
      throw new NotFoundException(`Member ${discordUserId} not found`);
    }

    const warning = this.warningRepository.create({
      ...dto,
      author_id: authorId,
      time: new Date(),
      member,
    });
    return this.warningRepository.save(warning);
  }

  async revoke(
    guildId: string,
    discordUserId: string,
    id: number,
  ): Promise<Warning> {
    await this.findOne(guildId, discordUserId, id);
    await this.warningRepository.update(id, { is_active: false });
    return this.findOne(guildId, discordUserId, id);
  }
}
