import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./guild.entity";

@Entity("twitch")
export class Twitch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  twitch_username!: string;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.twitch_channels, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
