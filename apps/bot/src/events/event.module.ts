import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exempted_role, Filtered_word } from '@wystrelia/shared';
import { BotModule } from 'src/discord/bot.module';
import { MessageCreateListener } from './message-create.listener';

@Module({
  imports: [
    BotModule,
    TypeOrmModule.forFeature([Filtered_word, Exempted_role]),
  ],
  providers: [MessageCreateListener],
})
export class EventModule {}
