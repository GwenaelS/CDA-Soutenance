import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level_config } from '@wystrelia/shared';
import { LevelConfigController } from './level-config.controller';
import { LevelConfigService } from './level-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Level_config])],
  controllers: [LevelConfigController],
  providers: [LevelConfigService],
})
export class LevelConfigModule {}
