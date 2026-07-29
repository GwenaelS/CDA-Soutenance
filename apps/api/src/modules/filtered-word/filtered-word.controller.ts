import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateFilteredWordDto } from './dto/create-filtered-word.dto';
import { FilteredWordService } from './filtered-word.service';
import { UpdateFilteredWordDto } from './dto/update-filtered-word.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GuildGuard } from '../auth/guards/guild.guard';

@Controller('guilds/:guildId/filtered-words')
@UseGuards(JwtGuard, GuildGuard)
export class FilteredWordController {
  constructor(private readonly filteredWordService: FilteredWordService) {}

  @Get()
  browse(@Param('guildId') guildId: string) {
    return this.filteredWordService.findAll(guildId);
  }

  @Get(':id')
  read(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.filteredWordService.findOne(guildId, id);
  }

  @Patch(':id')
  edit(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFilteredWordDto,
  ) {
    return this.filteredWordService.update(guildId, id, dto);
  }

  @Post()
  add(@Param('guildId') guildId: string, @Body() dto: CreateFilteredWordDto) {
    return this.filteredWordService.create(guildId, dto);
  }

  @Delete(':id')
  destroy(
    @Param('guildId') guildId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.filteredWordService.delete(guildId, id);
  }
}
