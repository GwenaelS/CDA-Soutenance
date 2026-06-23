import { Injectable } from '@nestjs/common';
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

  findAll(): Promise<Filtered_word[]> {
    return this.filteredWordRepository.find();
  }

  findOne(id: number): Promise<Filtered_word> {
    return this.filteredWordRepository.findOneByOrFail({ id });
  }

  async update(id: number, dto: UpdateFilteredWordDto): Promise<Filtered_word> {
    await this.filteredWordRepository.update(id, dto);
    return this.findOne(id);
  }

  create(dto: CreateFilteredWordDto): Promise<Filtered_word> {
    const word = this.filteredWordRepository.create(dto);
    return this.filteredWordRepository.save(word);
  }

  async delete(id: number): Promise<void> {
    const word = await this.findOne(id);
    await this.filteredWordRepository.remove(word);
  }
}
