import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Guild } from "./guild.entity";

@Entity("level_reward")
@Unique("Unique_level_reward", ["guild", "level"])
export class Level_reward {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  level!: number;

  @Column({ type: "bigint", unsigned: true })
  role_id!: string;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.level_rewards)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
