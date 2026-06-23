import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogEntity } from "../entities/log.entity";

@Module({
    imports: [TypeOrmModule.forFeature([LogEntity])],
    providers: [BotService],
    exports: [BotService],
})
export class BotModule {}