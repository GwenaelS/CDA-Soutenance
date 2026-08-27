import { Member } from "./member.entity";
export declare class Warning {
    id: number;
    author_id: string;
    reason: string;
    time: Date;
    is_active: boolean;
    member: Member;
}
