import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild } from '@wystrelia/shared';
import { In, Repository } from 'typeorm';

@Injectable()
export class GuildService {
  constructor(
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
  ) {}

  // Return all guilds the user is authorized on
  async findAll(guildIds: string[]): Promise<Guild[]> {
    return this.guildRepository.find({ where: { guild_id: In(guildIds) } });
  }

  // Return a guild by its Discord id
  async findOne(guildId: string): Promise<Guild> {
    const guild = await this.guildRepository.findOneBy({ guild_id: guildId });
    if (!guild) {
      throw new NotFoundException(`Guild ${guildId} not found`);
    }
    return guild;
  }
}
