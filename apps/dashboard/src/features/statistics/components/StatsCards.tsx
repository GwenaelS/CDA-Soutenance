import type { DashboardServer } from "@wystrelia/shared/types";
import { Users, MessageSquare, Trophy, Activity } from "lucide-react";

// Utilise la fake data serveur du composant members ! 

export function StatsCards({ server }: { server: DashboardServer }) {
  const members = server.members || [];
  const stats = server.stats || { total: 0, online: 0, new7d: 0, boosters: 0 };

  const avgLevel = Math.round(members.reduce((acc, m) => acc + m.level, 0) / members.length) || 0;
  const topMember = [...members].sort((a, b) => b.level - a.level)[0];
  const topMemberName = topMember ? topMember.username : "Aucun";
  const topMemberLevel = topMember ? topMember.level : 0;

  const cards = [
    {
      title: "Membres total",
      value: stats.total,
      sub: `+${stats.new7d} cette semaine`,
      color: "text-cyan-400",
      icon: Users
    },
    {
      title: "Messages / jour",
      value: Math.round(stats.total * 0.67),
      sub: "+8% vs mois dern.",
      color: "text-cyan-400",
      icon: MessageSquare
    },
    {
      title: "Niveau moyen",
      value: avgLevel,
      sub: `Top : ${topMemberName} (${topMemberLevel})`,
      color: "text-purple-400",
      icon: Trophy
    },
    {
      title: "Actifs (7j)",
      value: Math.round(stats.total * 0.38),
      sub: `${Math.round((stats.online / (stats.total || 1)) * 100)}% du royaume`,
      color: "text-purple-400",
      icon: Activity
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-[#140030]/50 border border-[#9D4EDD]/75 rounded-xl p-5 hover:border-cyan-500 transition-all duration-300">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Icon size={18} className="p-1 bg-[#0c0020] border border-border/30 rounded w-7 h-7" />
              <span className="text-xs font-bold text-[#8e7aab] uppercase tracking-wider">{card.title}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-[#cfd9e8] tracking-tight">{card.value.toLocaleString("fr-FR")}</h3>
              <p className={`text-xs font-semibold mt-1 ${card.color}`}>{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
