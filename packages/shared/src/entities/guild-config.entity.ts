import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./guild.entity";

@Entity("guild_config")
export class Guild_config {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  welcome_channel_id!: string | null;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  member_count_channel_id!: string | null;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  all_log_channel_id!: string | null;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  birthday_channel_id!: string | null;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  twitch_channel_id!: string | null;

  // ------------- Relations 1,1 -------------
  @OneToOne(() => Guild, (guild) => guild.guild_config, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
