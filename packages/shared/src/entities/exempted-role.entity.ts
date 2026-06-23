import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Guild } from "./guild.entity";

@Entity("exempted_role")
export class Exempted_role {
  @PrimaryColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true })
  role_id!: string;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.exempted_roles)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
