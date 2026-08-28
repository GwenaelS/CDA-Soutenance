import type { ServerStats } from "@wystrelia/shared/types";
import { Users, Wifi, Star, Zap } from "lucide-react";

export function MemberStats({ stats }: { stats: ServerStats }) {
  const cards = [
    { t: "Membres total", v: stats.total, s: `+${stats.new7d} cette semaine`, c: "text-cyan-400", i: Users },
    { t: "En ligne", v: stats.online, s: `${Math.round((stats.online / stats.total) * 100)}% du royaume`, c: "text-cyan-400", i: Wifi },
    { t: "Nouveaux (7j)", v: stats.new7d, s: "+12% vs sem. dern.", c: "text-emerald-400", i: Star },
    { t: "Boosters", v: stats.boosters, s: "Niveau 3 atteint", c: "text-purple-400", i: Zap } // C'est faut hien ses bien 14 boosts pour avoir le attiendre le nieau 3 a la base :)
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => {
        const Icon = card.i;
        return (
          <div key={idx} className="group bg-[#140030]/50 border border-[#9D4EDD]/75 rounded-xl p-5 hover:border-cyan-500 transition-all duration-300">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Icon size={18} className="p-1 bg-[#0c0020] border border-border/30 rounded w-7 h-7" />
              <span className="text-xs font-bold text-[#8e7aab] uppercase tracking-wider">{card.t}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-[#cfd9e8] tracking-tight">{card.v.toLocaleString("fr-FR")}</h3>
              <p className={`text-xs font-semibold mt-1 ${card.c}`}>{card.s}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
