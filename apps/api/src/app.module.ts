import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilteredWordModule } from './modules/filtered-word/filtered-word.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuildModule } from './modules/guild/guild.module';
import { MemberModule } from './modules/member/member.module';
import { LogModule } from './modules/log/log.module';
import { GuildConfigModule } from './modules/guild-config/guild-config.module';
import { ExemptedRoleModule } from './modules/exempted-role/exempted-role.module';
import { LevelConfigModule } from './modules/level-config/level-config.module';
import { LevelRewardModule } from './modules/level-reward/level-reward.module';
import { WarningModule } from './modules/warning/warning.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    GuildModule,
    MemberModule,
    LogModule,
    GuildConfigModule,
    FilteredWordModule,
    ExemptedRoleModule,
    WarningModule,
    LevelConfigModule,
    LevelRewardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
