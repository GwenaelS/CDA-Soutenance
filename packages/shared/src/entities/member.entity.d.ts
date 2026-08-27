import { Guild } from "./guild.entity";
import { Warning } from "./warning.entity";
import { Birthday } from "./birthday.entity";
export declare class Member {
    id: number;
    discord_user_id: string;
    current_xp: number;
    current_level: number;
    last_xp_at: Date | null;
    joined_at: Date;
    left_at: Date | null;
    guild: Guild;
    warnings: Warning[];
    birthday: Birthday | null;
}
