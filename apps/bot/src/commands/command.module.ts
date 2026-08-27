import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel_log, Guild_config, Log } from '@wystrelia/shared';
import { AuditService } from 'src/utils/audit.service';
import { BanCommand } from './ban.command';
import { CommandRegistryService } from './command-registry.service';
import { COMMANDS, Command } from './command.interface';
import { KickCommand } from './kick.command';
import { PingCommand } from './ping.command';
import { TimeoutCommand } from './timeout.command';
import { UnbanCommand } from './unban.command';

const COMMAND_PROVIDERS = [
  PingCommand,
  KickCommand,
  BanCommand,
  UnbanCommand,
  TimeoutCommand,
];

@Module({
  imports: [TypeOrmModule.forFeature([Log, Channel_log, Guild_config])],
  providers: [
    ...COMMAND_PROVIDERS,
    AuditService,
    {
      provide: COMMANDS,
      useFactory: (...commands: Command[]) => commands,
      inject: COMMAND_PROVIDERS,
    },
    CommandRegistryService,
  ],
  exports: [CommandRegistryService],
})
export class CommandModule {}
