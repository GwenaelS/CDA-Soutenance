import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateFilteredWordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  word!: string;
}
