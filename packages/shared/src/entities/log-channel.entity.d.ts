import { LogType } from "../enum";
import { Guild } from "./guild.entity";
export declare class Channel_log {
    id: number;
    type: LogType;
    channel_id: string;
    guild: Guild;
}
