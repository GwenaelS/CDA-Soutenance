import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level_reward } from '@wystrelia/shared';
import { Repository } from 'typeorm';
import { CreateLevelRewardDto } from './dto/create-level-reward.dto';
import { UpdateLevelRewardDto } from './dto/update-level-reward.dto';

@Injectable()
export class LevelRewardService {
  constructor(
    @InjectRepository(Level_reward)
    private readonly levelRewardRepository: Repository<Level_reward>,
  ) {}

  // Return all the level rewards
  findAll(guildId: string): Promise<Level_reward[]> {
    return this.levelRewardRepository.find({
      where: { guild: { guild_id: guildId } },
    });
  }

  // Return a level reward by an id
  async findOne(guildId: string, id: number): Promise<Level_reward> {
    const reward = await this.levelRewardRepository.findOneBy({
      id,
      guild: { guild_id: guildId },
    });
    if (!reward) {
      throw new NotFoundException(`Level reward ${id} not found`);
    }
    return reward;
  }

  //
  private async isLevelAvailable(
    guildId: string,
    level: number,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.levelRewardRepository.findOneBy({
      level,
      guild: { guild_id: guildId },
    });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        `a reward already exists for level ${level} in this guild`,
      );
    }
  }

  // Create a new level reward
  async create(
    guildId: string,
    dto: CreateLevelRewardDto,
  ): Promise<Level_reward> {
    await this.isLevelAvailable(guildId, dto.level);
    const reward = this.levelRewardRepository.create({
      ...dto,
      guild: { guild_id: guildId },
    });
    return this.levelRewardRepository.save(reward);
  }

  // Update a level reward
  async update(
    guildId: string,
    id: number,
    dto: UpdateLevelRewardDto,
  ): Promise<Level_reward> {
    await this.findOne(guildId, id);
    if (dto.level !== undefined) {
      await this.isLevelAvailable(guildId, dto.level, id);
    }
    await this.levelRewardRepository.update(id, dto);
    return this.findOne(guildId, id);
  }

  // Delete a level reward
  async delete(guildId: string, id: number): Promise<void> {
    const reward = await this.findOne(guildId, id);
    await this.levelRewardRepository.remove(reward);
  }
}
