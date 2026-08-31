import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Guild_config,
  Level_config,
  Level_reward,
  Log,
  Log_channel,
  Member,
  Warning,
} from '@wystrelia/shared';
import { AuditService } from 'src/utils/audit.service';
import { LevelService } from 'src/utils/level.service';
import { MemberService } from 'src/utils/member.service';
import { AddlevelsCommand } from './addlevels.command';
import { AddxpCommand } from './addxp.command';
import { AnnounceCommand } from './announce.command';
import { BanCommand } from './ban.command';
import { ClearCommand } from './clear.command';
import { CommandRegistryService } from './command-registry.service';
import { COMMANDS, Command } from './command.interface';
import { KickCommand } from './kick.command';
import { LockCommand } from './lock.command';
import { ModhelpCommand } from './modhelp.command';
import { PingCommand } from './ping.command';
import { RankCommand } from './rank.command';
import { ResetCommand } from './reset.command';
import { SetlevelsCommand } from './setlevels.command';
import { SetxpCommand } from './setxp.command';
import { TimeoutCommand } from './timeout.command';
import { TopCommand } from './top.command';
import { UnbanCommand } from './unban.command';
import { UnlockCommand } from './unlock.command';
import { UntimeoutCommand } from './untimeout.command';
import { UnwarnCommand } from './unwarn.command';
import { UserinfoCommand } from './userinfo.command';
import { WarnCommand } from './warn.command';
import { WarningsCommand } from './warnings.command';

const COMMAND_PROVIDERS = [
  PingCommand,
  KickCommand,
  BanCommand,
  UnbanCommand,
  TimeoutCommand,
  UntimeoutCommand,
  WarnCommand,
  UnwarnCommand,
  WarningsCommand,
  UserinfoCommand,
  LockCommand,
  UnlockCommand,
  ClearCommand,
  ModhelpCommand,
  RankCommand,
  TopCommand,
  AddxpCommand,
  SetxpCommand,
  AddlevelsCommand,
  SetlevelsCommand,
  ResetCommand,
  AnnounceCommand,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Log,
      Log_channel,
      Guild_config,
      Member,
      Warning,
      Level_config,
      Level_reward,
    ]),
  ],
  providers: [
    ...COMMAND_PROVIDERS,
    AuditService,
    MemberService,
    LevelService,
    {
      provide: COMMANDS,
      useFactory: (...commands: Command[]) => commands,
      inject: COMMAND_PROVIDERS,
    },
    CommandRegistryService,
  ],
  exports: [CommandRegistryService, MemberService, LevelService, AuditService],
})
export class CommandModule {}
