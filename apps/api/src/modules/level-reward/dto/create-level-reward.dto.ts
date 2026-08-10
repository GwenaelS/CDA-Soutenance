import { IsInt, IsNotEmpty, IsNumberString, Min } from 'class-validator';

export class CreateLevelRewardDto {
  @IsInt()
  @Min(1)
  level!: number;

  @IsNumberString()
  @IsNotEmpty()
  role_id!: string;
}
