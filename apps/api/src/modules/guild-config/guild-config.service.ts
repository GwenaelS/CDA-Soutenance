import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild_config } from '@wystrelia/shared';
import { Repository } from 'typeorm';
import { UpdateGuildConfigDto } from './dto/update-guild-config.dto';

@Injectable()
export class GuildConfigService {
  constructor(
    @InjectRepository(Guild_config)
    private readonly guildConfigRepository: Repository<Guild_config>,
  ) {}

  // Return the config of a guild
  async findOne(guildId: string): Promise<Guild_config> {
    const config = await this.guildConfigRepository.findOneBy({
      guild: { guild_id: guildId },
    });
    if (!config) {
      throw new NotFoundException(`Guild config for ${guildId} not found`);
    }
    return config;
  }

  // Update the config of a guild
  async update(
    guildId: string,
    dto: UpdateGuildConfigDto,
  ): Promise<Guild_config> {
    const config = await this.findOne(guildId);
    await this.guildConfigRepository.update(config.id, dto);
    return this.findOne(guildId);
  }
}
