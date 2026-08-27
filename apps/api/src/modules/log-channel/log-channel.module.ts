import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log_channel } from '@wystrelia/shared';
import { LogChannelController } from './log-channel.controller';
import { LogChannelService } from './log-channel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log_channel])],
  controllers: [LogChannelController],
  providers: [LogChannelService],
})
export class LogChannelModule {}
