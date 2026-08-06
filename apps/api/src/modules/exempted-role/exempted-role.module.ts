import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exempted_role } from '@wystrelia/shared';
import { ExemptedRoleController } from './exempted-role.controller';
import { ExemptedRoleService } from './exempted-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exempted_role])],
  controllers: [ExemptedRoleController],
  providers: [ExemptedRoleService],
})
export class ExemptedRoleModule {}
