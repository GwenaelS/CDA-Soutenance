import type { Server } from "./layout";

export interface MemberRole {
  name: string;
  color: string;
}

export interface Member {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  roles: MemberRole[];
  level: number;
  levelProgress: number;
  joinedAt: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  isBooster: boolean;
  boosterSince?: string;
}

export interface ServerStats {
  total: number;
  online: number;
  new7d: number;
  boosters: number;
}

export interface DashboardServer extends Server {
  members?: Member[];
  stats?: ServerStats;
}
