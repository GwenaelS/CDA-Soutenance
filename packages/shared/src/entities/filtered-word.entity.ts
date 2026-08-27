import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./guild.entity";

@Entity("filtered_word")
export class Filtered_word {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  word!: string;

  @Column({ type: "datetime" })
  time!: Date;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.filtered_words, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
