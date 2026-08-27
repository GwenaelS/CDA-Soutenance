import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exempted_role, Filtered_word, Guild } from '@wystrelia/shared';
import { CommandModule } from 'src/commands/command.module';
import { BotModule } from 'src/discord/bot.module';
import { GuildSyncService } from 'src/discord/guild-sync.service';
import { GuildLifecycleListener } from './guild-lifecycle.listener';
import { InteractionCreateListener } from './interaction-create.listener';
import { MessageCreateListener } from './message-create.listener';

@Module({
  imports: [
    BotModule,
    CommandModule,
    TypeOrmModule.forFeature([Filtered_word, Exempted_role, Guild]),
  ],
  providers: [
    MessageCreateListener,
    InteractionCreateListener,
    GuildLifecycleListener,
    GuildSyncService,
  ],
})
export class EventModule {}
