import { useState, useMemo, useEffect } from "react";
import type { DashboardServer } from "@wystrelia/shared/types";
import { MemberStats } from "./components/MemberStats";
import { MemberRow } from "./components/MemberRow";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export function MembersPage({ server }: { server: DashboardServer }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  useEffect(() => { setPage(1); }, [search, server.id]);

  const stats = useMemo(() => {
    if (server.stats) return server.stats;
    const m = server.members || [];
    return {
      total: m.length,
      online: m.filter(x => x.status !== "offline").length,
      new7d: Math.round(m.length * 0.15),
      boosters: m.filter(x => x.isBooster).length
    };
  }, [server]);

  const filtered = useMemo(() => {
    const m = server.members || [];
    return m.filter(x =>
      x.username.toLowerCase().includes(search.toLowerCase()) ||
      x.displayName.toLowerCase().includes(search.toLowerCase()) ||
      x.id.includes(search)
    );
  }, [server.members, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const paginated = useMemo(() => filtered.slice((page - 1) * size, page * size), [filtered, page]);
  const start = filtered.length === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(page * size, filtered.length);

  return (
    <div className="space-y-6 text-[#dcb6fb]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* a voir si on garde ----*/}
          <span className="text-[11px] font-bold text-[#8e7aab] tracking-widest uppercase">Général / Liste des membres</span>
          <h1 className="text-4xl font-extrabold text-[#cfd9e8] tracking-tight mt-1">Liste des membres</h1>
          {/* ---- a voir si on garde */}
          <p className="text-sm font-semibold text-[#8e7aab] mt-1.5">{stats.total.toLocaleString("fr-FR")} Membres dans le serveur <span className="text-[#25f8ff]">{server.name}</span></p>
        </div>
        <div className="relative md:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e7aab]" />
          <input
            type="text"
            placeholder="Rechercher un membre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#140030]/80 border border-border/40 focus:border-[#25f8ff] rounded-xl py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-[#8e7aab]/60 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      <MemberStats stats={stats} />

      <div className="overflow-x-auto bg-[#140030]/50 backdrop-blur-md border border-border/40 rounded-xl overflow-hidden shadow-lg">
        <table className="min-w-full divide-y divide-border/20 text-left">
          <thead className="bg-[#0c0020]/40 text-xs font-extrabold text-[#8e7aab] tracking-wider uppercase">
            <tr>
              <th className="px-6 py-4">Membre</th>
              <th className="px-6 py-4">Identifiant Discord</th>
              <th className="px-6 py-4">Rôles</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Rejoint</th>
              {/* a voir si on mais autres chose par la suite car cette version est une maquette */}
              <th className="px-6 py-4 text-right">???</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {paginated.length > 0 ? paginated.map(m => <MemberRow key={m.id} member={m} />) : (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-sm font-semibold text-[#8e7aab]">Aucun membre trouvé.</td></tr>
            )}
          </tbody>
        </table>

        <div className="bg-[#0c0020]/20 border-t border-border/10 px-6 py-4 flex items-center justify-between gap-4 select-none">
          <span className="text-xs font-semibold text-[#8e7aab]">Affichage de {start} à {end} sur {filtered.length} membres</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={`p-1.5 rounded-lg border text-[#8e7aab] cursor-pointer ${page === 1 ? "border-border/10 opacity-30 cursor-not-allowed" : "border-border/40 hover:border-[#25f8ff]/50 hover:text-white"}`}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-bold border cursor-pointer ${page === p ? "bg-purple-600/30 border-cyan-400 text-white shadow-[0_0_8px_rgba(37,248,255,0.2)]" : "border-border/20 text-[#8e7aab] hover:border-border/60 hover:text-white"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className={`p-1.5 rounded-lg border text-[#8e7aab] cursor-pointer ${page === pages ? "border-border/10 opacity-30 cursor-not-allowed" : "border-border/40 hover:border-[#25f8ff]/50 hover:text-white"}`}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
