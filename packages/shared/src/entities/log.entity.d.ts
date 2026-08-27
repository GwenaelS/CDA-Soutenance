import { LogType } from "../enum";
import { Guild } from "./guild.entity";
export declare class Log {
    id: number;
    target_id: string;
    author_id: string;
    type: LogType;
    reason: string;
    duration: number | null;
    expire_at: Date | null;
    datetime: Date;
    guild: Guild;
}
