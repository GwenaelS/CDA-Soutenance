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
export declare class Guild {
    guild_id: string;
    guild_name: string;
    guild_config: Guild_config;
    level_config: Level_config;
    level_rewards: Level_reward[];
    members: Member[];
    logs: Log[];
    channelLogs: Channel_log[];
    filtered_words: Filtered_word[];
    exempted_roles: Exempted_role[];
    automatic_roles: Automatic_role[];
    moc_channels: Moc_channel[];
    embeds: Embed[];
    twitch_channels: Twitch[];
}
