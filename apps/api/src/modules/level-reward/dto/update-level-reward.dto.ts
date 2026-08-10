import { PartialType } from '@nestjs/swagger';
import { CreateLevelRewardDto } from './create-level-reward.dto';

export class UpdateLevelRewardDto extends PartialType(CreateLevelRewardDto) {}
