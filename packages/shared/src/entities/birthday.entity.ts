import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Member } from "./member.entity";

@Entity("birthday")
export class Birthday {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "datetime" })
  datetime!: Date;

  @Column({ type: "datetime", nullable: true })
  date_post!: Date | null;

  // ------------- Relations 0,1 -------------
  @OneToOne(() => Member, (member) => member.birthdays)
  @JoinColumn({ name: "member_id" })
  member!: Member;
}
