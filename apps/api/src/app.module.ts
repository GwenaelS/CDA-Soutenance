import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilteredWordModule } from './modules/filtered-word/filtered-word.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuildModule } from './modules/guild/guild.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    GuildModule,
    FilteredWordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
