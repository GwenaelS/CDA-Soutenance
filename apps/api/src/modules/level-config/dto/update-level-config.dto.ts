import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateLevelConfigDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  max_level?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  xp_multiplier?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp_per_message?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp_per_voice_min?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp_cooldown_sec?: number;
}
