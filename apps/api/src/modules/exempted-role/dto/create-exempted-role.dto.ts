import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateExemptedRoleDto {
  @IsNumberString()
  @IsNotEmpty()
  role_id!: string;
}
