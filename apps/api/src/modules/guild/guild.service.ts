import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild } from '@wystrelia/shared';
import { Repository } from 'typeorm';

@Injectable()
export class GuildService {
  constructor(
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
  ) {}

  // Return a guild by its Discord id
  async findOne(guildId: string): Promise<Guild> {
    const guild = await this.guildRepository.findOneBy({ guild_id: guildId });
    if (!guild) {
      throw new NotFoundException(`Guild ${guildId} not found`);
    }
    return guild;
  }
}
