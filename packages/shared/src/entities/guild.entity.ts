import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Guild_config } from "./guild-config.entity";
import { Level_config } from "./level-config.entity";
import { Level_reward } from "./level-reward.entity";
import { Member } from "./member.entity";
import { Channel_log } from "./log-channel.entity";
import { Filtered_word } from "./filtered-word.entity";
import { Exempted_role } from "./exempted-role.entity";
import { Automatic_role } from "./automatic-role.entity";
import { Moc_channel } from "./moc-channel.entity";
import { Embed } from "./embed.entity";
import { Twitch } from "./twitch.entity";
import { Log } from "./log.entity";

@Entity("guild")
export class Guild {
  // Snowflake Discord = clé naturelle, fournie par Discord (pas auto-générée)
  @PrimaryColumn({ type: "bigint", unsigned: true, nullable: false })
  guild_id!: string;

  @Column({ type: "varchar", length: 100 })
  guild_name!: string;

  // ------------- Relations 1,1 -------------
  @OneToOne(() => Guild_config, (guildConfig) => guildConfig.guild)
  guild_config!: Guild_config;

  @OneToOne(() => Level_config, (levelConfig) => levelConfig.guild)
  level_config!: Level_config;

  // ------------- Relations 1,n -------------
  @OneToMany(() => Level_reward, (levelReward) => levelReward.guild)
  level_rewards!: Level_reward[];

  @OneToMany(() => Member, (member) => member.guild)
  members!: Member[];

  @OneToMany(() => Log, (log) => log.guild)
  logs!: Log[];

  @OneToMany(() => Channel_log, (channelLog) => channelLog.guild)
  channelLogs!: Channel_log[];

  @OneToMany(() => Filtered_word, (filteredWord) => filteredWord.guild)
  filtered_words!: Filtered_word[];

  @OneToMany(() => Exempted_role, (exemptedRole) => exemptedRole.guild)
  exempted_roles!: Exempted_role[];

  @OneToMany(() => Automatic_role, (automaticRole) => automaticRole.guild)
  automatic_roles!: Automatic_role[];

  @OneToMany(() => Moc_channel, (mocChannel) => mocChannel.guild)
  moc_channels!: Moc_channel[];

  @OneToMany(() => Embed, (embed) => embed.guild)
  embeds!: Embed[];

  @OneToMany(() => Twitch, (twitch) => twitch.guild)
  twitch_channels!: Twitch[];
}
