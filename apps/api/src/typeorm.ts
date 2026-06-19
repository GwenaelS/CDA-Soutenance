import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('guild')
export class Guild {
  // Snowflake Discord = clé naturelle, fournie par Discord (pas auto-générée)
  @PrimaryColumn({ type: 'bigint' })
  guild_id!: number;

  @Column({ type: 'varchar', length: 255 })
  guild_name!: string;

  // ------------- Relations 1,1 -------------------------------------------
  @OneToOne()

  @OneToOne()

  // ------------- Relations 1,n -------------------------------------------
  @OneToMany()
}

@Entity('guild_config')
export class Guild_config {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint' })
  welcome_channel_id!: string;

  @Column({ type: 'bigint' })
  member_count_channel_id!: string;

  @Column({ type: 'bigint' })
  all_log_channel_id!: string;

  @Column({ type: 'bigint' })
  birthday_channel_id!: string;

  @Column({ type: 'bigint' })
  twitch_channel_id!: string;

  // ------------- Relations 1,1 -------------------------------------------
  @OneToOne()
}

@Entity('level_config')
export class Level_config {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  max_level!: number

  @Column()
  xp_multiplier!: number;

  @Column()
  xp_per_message!: number;

  @Column()
  xp_per_voice_min!: number;

  @Column()
  xp_cooldown_sec!: number;

  // ------------- Relations 1,1 -------------------------------------------
  @OneToOne()
}

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn()
  member_id!: number;

  @Column({ type: 'bigint' })
  discord_user_id!: string;

  @Column()
  current_xp!: number;

  @Column()
  current_level!: number;

  @Column()
  last_xp_at!: Date;

  @Column()
  joined_at!: Date;

  @Column()
  left_at!: Date;

  // ------------- Relations n,1 -------------------------------------------
  @ManyToOne()
}

@Entity('birthday')
export class Birthday {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint' })
  discord_user_id!: string;

  @Column()
  datetime!: Date;

  @Column()
  date_post!: Date;

  // ------------- Relations x,x -------------------------------------------
}

@Entity('warning')
export class Warning {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint' })
  target_id!: string;

  @Column({ type: 'bigint' })
  author_id!: string;

  @Column()
  reason!: string;

  @Column()
  is_active!: boolean;

  // ------------- Relations x,x -------------------------------------------
}

@Entity('mute')
export class Mute {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mute_duration!: number;

  @Column()
  started_at!: Date;

  @Column()
  expire_at!: Date;

  // ------------- Relations x,x -------------------------------------------
}

@Entity('automatic_role')
export class Automatic_role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint' })
  role_id!: string;

  // ------------- Relations x,x -------------------------------------------
}

@Entity('embed')
export class Embed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  color!: string;

  // ------------- Relations x,x -------------------------------------------
}