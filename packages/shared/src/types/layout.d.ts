export type HeaderProps = {
    botName?: string;
    botAvatarUrl?: string;
    selectedServerName?: string;
};
export interface Server {
    id: number;
    name: string;
    icon: string;
    gradient: string;
    isActive: boolean;
}
export interface ServerListProps {
    selectedServer: Server;
    setSelectedServer: (server: Server) => void;
    servers: Server[];
    currentPath?: string;
    onNavigate?: (path: string) => void;
}
