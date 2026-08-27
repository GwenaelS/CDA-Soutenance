import { Member } from "./member.entity";
export declare class Birthday {
    id: number;
    datetime: Date;
    date_post: Date | null;
    member: Member;
}
