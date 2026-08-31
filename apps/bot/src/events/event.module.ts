import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Automatic_role,
  Birthday,
  Exempted_role,
  Filtered_word,
  Guild,
  Guild_config,
  Moc_channel,
} from '@wystrelia/shared';
import { CommandModule } from 'src/commands/command.module';
import { BotModule } from 'src/discord/bot.module';
import { GuildSyncService } from 'src/discord/guild-sync.service';
import { BirthdayCronService } from './birthday-cron.service';
import { GuildLifecycleListener } from './guild-lifecycle.listener';
import { GuildMemberListener } from './guild-member.listener';
import { InteractionCreateListener } from './interaction-create.listener';
import { MessageCreateListener } from './message-create.listener';
import { MocListener } from './moc.listener';
import { XpMessageListener } from './xp-message.listener';
import { XpVoiceListener } from './xp-voice.listener';

@Module({
  imports: [
    BotModule,
    CommandModule,
    TypeOrmModule.forFeature([
      Filtered_word,
      Exempted_role,
      Guild,
      Automatic_role,
      Guild_config,
      Birthday,
      Moc_channel,
    ]),
  ],
  providers: [
    MessageCreateListener,
    InteractionCreateListener,
    GuildLifecycleListener,
    GuildSyncService,
    XpMessageListener,
    XpVoiceListener,
    GuildMemberListener,
    BirthdayCronService,
    MocListener,
  ],
})
export class EventModule {}
