import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filtered_word } from '@wystrelia/shared';
import { Repository } from 'typeorm';
import { CreateFilteredWordDto } from './dto/create-filtered-word.dto';
import { UpdateFilteredWordDto } from './dto/update-filtered-word.dto';

@Injectable()
export class FilteredWordService {
  constructor(
    @InjectRepository(Filtered_word)
    private readonly filteredWordRepository: Repository<Filtered_word>,
  ) {}

  // Method that return all forbidden words
  findAll(guildId: string): Promise<Filtered_word[]> {
    return this.filteredWordRepository.find({
      where: { guild: { guild_id: guildId } },
    });
  }

  // Method that return a forbidden word by an id
  async findOne(guildId: string, id: number): Promise<Filtered_word> {
    const word = await this.filteredWordRepository.findOneBy({
      id,
      guild: { guild_id: guildId },
    });
    if (!word) {
      throw new NotFoundException(`Filtered word ${id} not found`);
    }
    return word;
  }

  // Method that update a forbidden word by an id
  async update(
    guildId: string,
    id: number,
    dto: UpdateFilteredWordDto,
  ): Promise<Filtered_word> {
    await this.findOne(guildId, id);
    await this.filteredWordRepository.update(id, dto);
    return this.findOne(guildId, id);
  }

  // Method that create a new forbidden word
  create(guildId: string, dto: CreateFilteredWordDto): Promise<Filtered_word> {
    const word = this.filteredWordRepository.create({
      ...dto,
      guild: { guild_id: guildId },
    });
    return this.filteredWordRepository.save(word);
  }

  // Method that delete a forbidden word by an id
  async delete(guildId: string, id: number): Promise<void> {
    const word = await this.findOne(guildId, id);
    await this.filteredWordRepository.remove(word);
  }
}
