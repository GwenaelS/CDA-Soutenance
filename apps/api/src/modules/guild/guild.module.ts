import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guild } from '@wystrelia/shared';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';

@Module({
  imports: [TypeOrmModule.forFeature([Guild])],
  controllers: [GuildController],
  providers: [GuildService],
})
export class GuildModule {}
