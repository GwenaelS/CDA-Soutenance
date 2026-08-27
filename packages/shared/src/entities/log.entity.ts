import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LogType } from "../enum";
import { Guild } from "./guild.entity";

@Entity("log")
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true })
  target_id!: string;

  @Column({ type: "bigint", unsigned: true })
  author_id!: string;

  @Column({ type: "enum", enum: LogType })
  type!: LogType;

  @Column({ type: "varchar", length: 255 })
  reason!: string;

  @Column({ type: "int", nullable: true })
  duration!: number | null;

  @Column({ type: "datetime", nullable: true })
  expire_at!: Date | null;

  @Column({ type: "datetime" })
  datetime!: Date;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.logs, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
