import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./guild.entity";

@Entity("moc_channel")
export class Moc_channel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true })
  moc_channel_id!: string;

  @Column({ type: "boolean" })
  allow_files!: boolean;

  @Column({ type: "boolean" })
  allow_images!: boolean;

  @Column({ type: "boolean" })
  allow_videos!: boolean;

  @Column({ type: "boolean" })
  allow_links!: boolean;

  @Column({ type: "boolean" })
  allow_text!: boolean;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.moc_channels, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
