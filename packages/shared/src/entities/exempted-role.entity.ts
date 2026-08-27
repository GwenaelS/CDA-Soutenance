import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./guild.entity";

@Entity("exempted_role")
export class Exempted_role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true })
  role_id!: string;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.exempted_roles, { nullable: false })
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
