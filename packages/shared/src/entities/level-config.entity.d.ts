import { Guild } from "./guild.entity";
export declare class Level_config {
    id: number;
    max_level: number;
    xp_multiplier: number;
    xp_per_message: number;
    xp_per_voice_min: number;
    xp_cooldown_sec: number;
    guild: Guild;
}
