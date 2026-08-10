import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level_reward } from '@wystrelia/shared';
import { LevelRewardService } from './level-reward.service';
import { LevelRewardController } from './level-reward.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Level_reward])],
  controllers: [LevelRewardController],
  providers: [LevelRewardService],
})
export class LevelRewardModule {}
