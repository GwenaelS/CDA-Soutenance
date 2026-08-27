import { LogType } from '@wystrelia/shared';
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateLogChannelDto {
  @IsEnum(LogType)
  type!: LogType;

  @IsNumberString()
  @IsNotEmpty()
  channel_id!: string;
}
