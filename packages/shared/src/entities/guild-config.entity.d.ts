import { Guild } from "./guild.entity";
export declare class Guild_config {
    id: number;
    welcome_channel_id: string | null;
    member_count_channel_id: string | null;
    all_log_channel_id: string | null;
    birthday_channel_id: string | null;
    twitch_channel_id: string | null;
    guild: Guild;
}
