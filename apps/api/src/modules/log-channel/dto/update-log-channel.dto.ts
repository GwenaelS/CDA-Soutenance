import { PartialType } from '@nestjs/swagger';
import { CreateLogChannelDto } from './create-log-channel.dto';

export class UpdateLogChannelDto extends PartialType(CreateLogChannelDto) {}
