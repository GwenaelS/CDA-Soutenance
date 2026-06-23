import { PartialType } from '@nestjs/swagger';
import { CreateFilteredWordDto } from './create-filtered-word.dto';

export class UpdateFilteredWordDto extends PartialType(CreateFilteredWordDto) {}
