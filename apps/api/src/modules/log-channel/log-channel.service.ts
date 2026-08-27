import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log_channel, LogType } from '@wystrelia/shared';
import { Repository } from 'typeorm';
import { CreateLogChannelDto } from './dto/create-log-channel.dto';
import { UpdateLogChannelDto } from './dto/update-log-channel.dto';

@Injectable()
export class LogChannelService {
  constructor(
    @InjectRepository(Log_channel)
    private readonly logChannelRepository: Repository<Log_channel>,
  ) {}

  findAll(guildId: string): Promise<Log_channel[]> {
    return this.logChannelRepository.find({
      where: { guild: { guild_id: guildId } },
    });
  }

  async findOne(guildId: string, id: number): Promise<Log_channel> {
    const logChannel = await this.logChannelRepository.findOneBy({
      id,
      guild: { guild_id: guildId },
    });
    if (!logChannel) {
      throw new NotFoundException(`Log channel ${id} not found`);
    }
    return logChannel;
  }

  private async isTypeAvailable(
    guildId: string,
    type: LogType,
    excludedId?: number,
  ): Promise<void> {
    const existing = await this.logChannelRepository.findOneBy({
      type,
      guild: { guild_id: guildId },
    });
    if (existing && existing.id !== excludedId) {
      throw new ConflictException(
        `A log channel already exists for type ${type} in this guild`,
      );
    }
  }

  async create(
    guildId: string,
    dto: CreateLogChannelDto,
  ): Promise<Log_channel> {
    await this.isTypeAvailable(guildId, dto.type);
    const logChannel = this.logChannelRepository.create({
      ...dto,
      guild: { guild_id: guildId },
    });
    return this.logChannelRepository.save(logChannel);
  }

  async update(
    guildId: string,
    id: number,
    dto: UpdateLogChannelDto,
  ): Promise<Log_channel> {
    await this.findOne(guildId, id);
    if (dto.type !== undefined) {
      await this.isTypeAvailable(guildId, dto.type, id);
    }
    await this.logChannelRepository.update(id, dto);
    return this.findOne(guildId, id);
  }

  async delete(guildId: string, id: number): Promise<void> {
    const logChannel = await this.findOne(guildId, id);
    await this.logChannelRepository.remove(logChannel);
  }
}
