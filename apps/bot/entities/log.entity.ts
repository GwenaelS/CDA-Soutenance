import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('logs')
export class LogEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    guild_id!: string;

    @Column()
    user_id!: string;

    @Column()
    action!: string;

    @Column({ type: 'text' })
    details!: string;

    @CreateDateColumn()
    created_at!: Date;
}