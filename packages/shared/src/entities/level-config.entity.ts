import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./guild.entity";

@Entity("level_config")
export class Level_config {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  max_level!: number;

  @Column({ type: "float" })
  xp_multiplier!: number;

  @Column({ type: "int" })
  xp_per_message!: number;

  @Column({ type: "int" })
  xp_per_voice_min!: number;

  @Column({ type: "int" })
  xp_cooldown_sec!: number;

  // ------------- Relations 1,1 -------------
  @OneToOne(() => Guild, (guild) => guild.level_config, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
