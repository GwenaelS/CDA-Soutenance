import { PartialType } from '@nestjs/swagger';
import { CreateExemptedRoleDto } from './create-exempted-role.dto';

export class UpdateExemptedRoleDto extends PartialType(CreateExemptedRoleDto) {}
