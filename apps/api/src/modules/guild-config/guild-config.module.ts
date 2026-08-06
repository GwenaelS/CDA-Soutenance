import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guild_config } from '@wystrelia/shared';
import { GuildConfigController } from './guild-config.controller';
import { GuildConfigService } from './guild-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Guild_config])],
  controllers: [GuildConfigController],
  providers: [GuildConfigService],
})
export class GuildConfigModule {}
