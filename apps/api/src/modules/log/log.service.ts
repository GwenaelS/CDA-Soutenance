import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from '@wystrelia/shared';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
  ) {}

  // Return all logs of a guild
  findAll(guildId: string): Promise<Log[]> {
    return this.logRepository.find({
      where: { guild: { guild_id: guildId } },
      order: { datetime: 'DESC' },
    });
  }
}
