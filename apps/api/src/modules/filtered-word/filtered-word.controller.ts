import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFilteredWordDto } from './dto/create-filtered-word.dto';
import { FilteredWordService } from './filtered-word.service';
import { UpdateFilteredWordDto } from './dto/update-filtered-word.dto';

@Controller('filtered-words')
export class FilteredWordController {
  constructor(private readonly filteredWordService: FilteredWordService) {}

  @Get()
  browse() {
    return this.filteredWordService.findAll();
  }

  @Get(':id')
  read(@Param('id', ParseIntPipe) id: number) {
    return this.filteredWordService.findOne(id);
  }

  @Patch(':id')
  edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFilteredWordDto,
  ) {
    return this.filteredWordService.update(id, dto);
  }

  @Post()
  add(@Body() dto: CreateFilteredWordDto) {
    return this.filteredWordService.create(dto);
  }

  @Delete(':id')
  destroy(@Param('id', ParseIntPipe) id: number) {
    return this.filteredWordService.delete(id);
  }
}
