import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotModule } from './discord/bot.module';
import {
  Automatic_role,
  Birthday,
  Channel_log,
  Embed,
  Exempted_role,
  Filtered_word,
  Guild,
  Guild_config,
  Level_config,
  Level_reward,
  Log,
  Member,
  Moc_channel,
  Mute,
  Twitch,
  Warning,
} from '@wystrelia/shared';
import { EventModule } from './events/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          Automatic_role,
          Birthday,
          Embed,
          Exempted_role,
          Filtered_word,
          Guild_config,
          Guild,
          Level_config,
          Level_reward,
          Channel_log,
          Log,
          Member,
          Moc_channel,
          Mute,
          Twitch,
          Warning,
        ],
        autoLoadEntities: true,
        synchronize: true,
        // migrations: [__dirname + '/migrations/*{.ts,.js}'],
        // migrationsRun: false,
      }),
    }),
    BotModule,
    EventModule,
  ],
})
export class AppModule {}
