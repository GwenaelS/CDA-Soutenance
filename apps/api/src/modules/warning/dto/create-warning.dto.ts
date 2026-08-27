import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWarningDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
