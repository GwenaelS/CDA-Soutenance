import { Guild } from "./guild.entity";
export declare class Moc_channel {
    id: number;
    moc_channel_id: string;
    allow_files: boolean;
    allow_images: boolean;
    allow_videos: boolean;
    allow_links: boolean;
    allow_text: boolean;
    guild: Guild;
}
