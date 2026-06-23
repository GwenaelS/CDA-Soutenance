import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateFilteredWordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  word!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{17,20}$/, {
    message: 'guild_id doit être un snowflake Discord valide',
  })
  guild_id!: string;
}
