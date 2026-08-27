import { Guild } from "./guild.entity";
export declare class Embed {
    id: number;
    title: string | null;
    description: string | null;
    color: string | null;
    guild: Guild;
}
