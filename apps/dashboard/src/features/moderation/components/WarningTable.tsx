import type { Warning } from "@wystrelia/shared/types";

export function WarningTable({
  warnings,
  onRemoveWarning
}: {
  warnings: Warning[];
  onRemoveWarning: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto bg-[#140030]/50 backdrop-blur-md border border-border/40 rounded-xl overflow-hidden shadow-lg">
      <table className="min-w-full divide-y divide-border/20 text-left">
        <thead className="bg-[#0c0020]/40 text-base font-extrabold text-[#8e7aab] tracking-wider uppercase">
          <tr className="text-[#cfd9e8]">
            <th className="px-6 py-4">Membre</th>
            <th className="px-6 py-4">Raison</th>
            <th className="px-6 py-4">Sévérité</th>
            <th className="px-6 py-4">Modérateur</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/10 text-base font-semibold">
          {warnings.length > 0 ? (
            warnings.map((w) => (
              <tr key={w.id} className="hover:bg-purple-950/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.member.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-full bg-[#140030] border border-border/20"
                    />
                    <div>
                      <p className="text-base font-bold text-[#cfd9e8]">{w.member.username}</p>
                      <p className="text-base text-[#8e7aab]">{w.member.displayName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#cfd9e8] max-w-xs truncate">{w.reason}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-base font-bold ${
                      w.severity === "Avertissement"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : w.severity === "Muet"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {w.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#cfd9e8]">{w.moderator}</td>
                <td className="px-6 py-4 text-[#cfd9e8]">{w.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {w.status === "Actif" ? (
                      <>
                        <span className="text-emerald-400 font-bold">Actif</span>
                        <button
                          onClick={() => onRemoveWarning(w.id)}
                          className="px-2 py-0.5 text-base uppercase font-bold border border-border/40 hover:border-rose-500/50 hover:bg-rose-500/10 text-[#8e7aab] hover:text-rose-400 rounded-md cursor-pointer transition"
                        >
                          Retirer
                        </button>
                      </>
                    ) : (
                      <span className="text-[#8e7aab]/60">Expiré</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-[#8e7aab]">
                Aucun avertissement trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
