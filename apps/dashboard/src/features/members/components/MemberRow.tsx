import type { Member } from "@wystrelia/shared/types";
import { Copy } from "lucide-react";

export function MemberRow({ member }: { member: Member }) {
  const getStatusColor = (status: Member["status"]) => {
    if (status === "online") return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]";
    if (status === "idle") return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]";
    if (status === "dnd") return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]";
    return "bg-slate-500";
  };

  return (
    <tr className="border-b border-border/10 hover:bg-[#140030]/20 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={member.avatarUrl} alt={member.username} className="w-10 h-10 rounded-full bg-[#0c0020] border border-border/30" />
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#140030] ${getStatusColor(member.status)}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white group-hover:text-cyan-400 truncate">{member.username}</span>
            <span className="text-xs text-[#8e7aab] font-medium truncate">{member.displayName}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div 
          onClick={() => { navigator.clipboard.writeText(member.id); alert("Identifiant copié !"); }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0c0020] border border-border/20 text-[11px] font-mono text-[#a855f7] cursor-pointer hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
        >
          <span>{member.id}</span>
          <Copy size={12} className="opacity-0 group-hover:opacity-100 text-[#8e7aab] hover:text-white transition-opacity shrink-0" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
          {member.roles.map((r, idx) => (
            <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: `${r.color}15`, color: r.color, borderColor: `${r.color}35` }}>
              {r.name}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3 w-40">
          <div className="flex-1 bg-[#0c0020] rounded-full h-1.5 overflow-hidden border border-border/20">
            <div className="bg-gradient-to-r from-purple-600 to-cyan-400 h-full rounded-full" style={{ width: `${member.levelProgress}%` }} />
          </div>
          <span className="text-xs font-extrabold text-[#dcb6fb] whitespace-nowrap">Niv. {member.level}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#dcb6fb]/80 font-medium">{member.joinedAt}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button onClick={() => alert("Gestion de " + member.username)} className="px-3 py-1 rounded bg-[#3c096c] hover:bg-[#7b2cbf] text-white text-xs font-bold transition-colors cursor-pointer border border-[#9d4edd]/30">
          Gérer
        </button>
      </td>
    </tr>
  );
}
