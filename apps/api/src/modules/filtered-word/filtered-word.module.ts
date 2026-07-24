import { Module } from '@nestjs/common';
import { FilteredWordController } from './filtered-word.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Filtered_word } from '@wystrelia/shared';
import { FilteredWordService } from './filtered-word.service';

@Module({
  imports: [TypeOrmModule.forFeature([Filtered_word])],
  controllers: [FilteredWordController],
  providers: [FilteredWordService],
})
export class FilteredWordModule {}
