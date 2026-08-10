import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level_config } from '@wystrelia/shared';
import { Repository } from 'typeorm';
import { UpdateLevelConfigDto } from './dto/update-level-config.dto';

@Injectable()
export class LevelConfigService {
  constructor(
    @InjectRepository(Level_config)
    private readonly levelConfigRepository: Repository<Level_config>,
  ) {}

  // Return the level config of a guild
  async findOne(guildId: string): Promise<Level_config> {
    const config = await this.levelConfigRepository.findOneBy({
      guild: { guild_id: guildId },
    });
    if (!config) {
      throw new NotFoundException(`Level config for ${guildId} not found`);
    }
    return config;
  }

  // Update the level config of a guild
  async update(
    guildId: string,
    dto: UpdateLevelConfigDto,
  ): Promise<Level_config> {
    const config = await this.findOne(guildId);
    await this.levelConfigRepository.update(config.id, dto);
    return this.findOne(guildId);
  }
}
