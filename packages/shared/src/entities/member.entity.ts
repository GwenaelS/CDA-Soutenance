import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Guild } from "./guild.entity";
import { Warning } from "./warning.entity";
import { Birthday } from "./birthday.entity";

@Entity("member")
@Unique("member_guild_discord", ["guild", "discord_user_id"])
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true })
  discord_user_id!: string;

  @Column({ type: "int", default: 0 })
  current_xp!: number;

  @Column({ type: "int", default: 0 })
  current_level!: number;

  @Column({ type: "datetime", nullable: true })
  last_xp_at!: Date | null;

  @Column({ type: "datetime" })
  joined_at!: Date;

  @Column({ type: "datetime", nullable: true })
  left_at!: Date | null;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.members, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;

  // ------------- Relations X,X -------------
  @OneToMany(() => Warning, (warning) => warning.member)
  warnings!: Warning[];

  @OneToOne(() => Birthday, (birthday) => birthday.member)
  birthday!: Birthday | null;
}
