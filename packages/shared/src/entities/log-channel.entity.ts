import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { LogType } from "../enum";
import { Guild } from "./guild.entity";

@Entity("log_channel")
@Unique("Unique_log_channel", ["guild", "type"])
export class Log_channel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: LogType })
  type!: LogType;

  @Column({ type: "bigint", unsigned: true })
  channel_id!: string;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.logsChannels, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
