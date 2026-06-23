import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Member } from "./member.entity";

@Entity("mute")
export class Mute {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  mute_duration!: number;

  @Column({ type: "datetime" })
  started_at!: Date;

  @Column({ type: "datetime" })
  expire_at!: Date;

  // ------------- Relations 0,n -------------
  @ManyToOne(() => Member, (member) => member.mutes)
  @JoinColumn({ name: "member_id" })
  member!: Member;
}
