import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./guild.entity";
import { Mute } from "./mute.entity";
import { Warning } from "./warning.entity";
import { Birthday } from "./birthday.entity";

@Entity("member")
export class Member {
  @PrimaryGeneratedColumn()
  member_id!: number;

  @Column({ type: "bigint", unsigned: true })
  discord_user_id!: string;

  @Column({ type: "int", default: 0 })
  current_xp!: number;

  @Column({ type: "int", default: 0 })
  current_level!: number;

  @Column({ type: "datetime", nullable: true })
  last_xp_at!: Date;

  @Column({ type: "datetime" })
  joined_at!: Date;

  @Column({ type: "datetime", nullable: true })
  left_at!: Date;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.members)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;

  // ------------- Relations X,X -------------
  @OneToMany(() => Mute, (mute) => mute.member)
  mutes!: Mute[];

  @OneToMany(() => Warning, (warning) => warning.member)
  warnings!: Warning[];

  @OneToMany(() => Birthday, (birthday) => birthday.member)
  birthdays!: Mute[] | null;
}
