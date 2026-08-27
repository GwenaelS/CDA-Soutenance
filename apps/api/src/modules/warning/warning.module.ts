import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, Warning } from '@wystrelia/shared';
import { WarningController } from './warning.controller';
import { WarningService } from './warning.service';

@Module({
  imports: [TypeOrmModule.forFeature([Warning, Member])],
  controllers: [WarningController],
  providers: [WarningService],
})
export class WarningModule {}
