import { IsNumberString, IsOptional } from 'class-validator';

export class UpdateGuildConfigDto {
  @IsOptional()
  @IsNumberString()
  welcome_channel_id?: string;

  @IsOptional()
  @IsNumberString()
  member_count_channel_id?: string;

  @IsOptional()
  @IsNumberString()
  all_log_channel_id?: string;

  @IsOptional()
  @IsNumberString()
  birthday_channel_id?: string;

  @IsOptional()
  @IsNumberString()
  twitch_channel_id?: string;
}
