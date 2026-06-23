import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./guild.entity";

@Entity("embed")
export class Embed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  title!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  color!: string | null;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.members)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
