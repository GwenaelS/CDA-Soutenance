import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Member } from "./member.entity";

@Entity("warning")
export class Warning {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true })
  target_id!: string;

  @Column({ type: "bigint", unsigned: true })
  author_id!: string;

  @Column({ type: "text" })
  reason!: string;

  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  // ------------- Relations 0,n -------------
  @ManyToOne(() => Member, (member) => member.warnings)
  @JoinColumn({ name: "member_id" })
  member!: Member;
}
