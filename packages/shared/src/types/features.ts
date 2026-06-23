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

export interface FilterWord {
  word: string;
  addedAt: string;
}

export interface FilterConfig {
  words: FilterWord[];
  exemptedRoles: string[]; // Noms des rôles exemptés
}

export interface AddFilterWorlProps {
  onAddWord: (work: string) => void;
}

export interface FilterWordListProps {
  words: FilterWord[];
  onDeleteWord: (word: string) => void;
}


export interface RoleExemptionProps {
  serverRoles: MemberRole[];
  exemptedRoles: string[];
  onAddExemptedRole: (roleName: string) => void;
  onRemoveExemptedRole: (roleName: string) => void;
}

export interface DashboardServer extends Server {
  members?: Member[];
  stats?: ServerStats;
  roles?: MemberRole[];
  filterConfig?: FilterConfig;
}
