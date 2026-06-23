import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LogType } from "../enum";
import { Guild } from "./guild.entity";

@Entity("channel_log")
export class Channel_log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: LogType })
  type!: LogType;

  @Column({ type: "bigint", unsigned: true })
  channel_id!: string;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.channelLogs)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
