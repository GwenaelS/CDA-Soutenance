import type { DashboardServer } from "@wystrelia/shared/types";
import { StatsCards } from "./components/StatsCards";
import { MemberGrowthChart } from "./components/MemberGrowthChart";

export function StatsPage({ server }: { server: DashboardServer }) {
    return (
        <div className="space-y-6">
            <div>
                <span className="text-[11px] font-bold text-[#8e7aab] tracking-widest uppercase">Général / Statistiques</span>
                <h1 className="text-4xl font-extrabold text-[#cfd9e8] tracking-tight mt-1">Statistiques</h1>
                <p className="text-sm font-semibold text-[#8e7aab] mt-1.5">Aperçu des 30 derniers jours</p>
            </div>

            <StatsCards server={server} />

            <MemberGrowthChart server={server} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-6 h-48">
                    {/* Autres stats du serveur */}
                </div>
                <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-6 h-48">
                    {/* Autre section du serveur */}
                </div>
            </div>
        </div>
    );
}
