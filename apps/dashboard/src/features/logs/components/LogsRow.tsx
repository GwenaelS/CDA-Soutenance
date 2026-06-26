import type { Log } from "@wystrelia/shared/types";
import { 
  UserPlus, UserMinus, Trash2, Pencil, ShieldCheck, ShieldX, AlertCircle, VolumeX, Ban, Star 
} from "lucide-react";

const CONFIG: Record<string, { icon: any, bg: string, clr: string, text: string }> = {
  JOIN: { icon: UserPlus, bg: "bg-cyan-500/10 border-cyan-500/20", clr: "text-cyan-400", text: "Nouveau membre" },
  LEAVE: { icon: UserMinus, bg: "bg-slate-500/10 border-slate-500/20", clr: "text-slate-400", text: "Départ" },
  DELETE: { icon: Trash2, bg: "bg-red-500/10 border-red-500/20", clr: "text-red-400", text: "Message supprimé" },
  EDIT: { icon: Pencil, bg: "bg-indigo-500/10 border-indigo-500/20", clr: "text-indigo-400", text: "Message édité" },
  ROLE_ADD: { icon: ShieldCheck, bg: "bg-purple-500/10 border-purple-500/20", clr: "text-purple-400", text: "Rôle attribué" },
  ROLE_REMOVE: { icon: ShieldX, bg: "bg-purple-500/10 border-purple-500/20", clr: "text-purple-400", text: "Rôle retiré" },
  WARN: { icon: AlertCircle, bg: "bg-purple-500/10 border-purple-500/20", clr: "text-purple-400", text: "Avertissement" },
  MUTE: { icon: VolumeX, bg: "bg-red-500/10 border-red-500/20", clr: "text-red-400", text: "Muet" },
  BAN: { icon: Ban, bg: "bg-red-500/10 border-red-500/20", clr: "text-red-400", text: "Bannissement" },
  BOOST: { icon: Star, bg: "bg-pink-500/10 border-pink-500/20", clr: "text-pink-400", text: "Boost Nitro" }
};

const TEMPLATES: Record<string, string> = {
  JOIN: "{target} a rejoint le serveur",
  LEAVE: "{target} a quitté le serveur",
  DELETE: "{target} supprimé dans {bold_raison} par {author}",
  EDIT: "{target} modifié dans {bold_raison}",
  ROLE_ADD: '{target} a reçu le rôle "{bold_raison}" de {author}',
  ROLE_REMOVE: '{target} "{raison}" retiré par {author}',
  WARN: "{target} émis par {author} - {raison}",
  MUTE: "{target} rendu muet par {author} - {raison}",
  BAN: "{target} banni par {author} - {raison}",
  BOOST: "{target} a boosté le serveur - {raison}"
};

function formatLogDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  if (month === 5 && date.getFullYear() === 2026) {
    if (day === 26) return `Auj. ${hours}:${minutes}`;
    if (day === 25) return `Hier ${hours}:${minutes}`;
  }
  
  const months = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
  return `${day} ${months[month] || "Juin"} ${hours}:${minutes}`;
}

export default function LogsRow({ log }: { log: Log }) {
    const type = log.type.toUpperCase();
    const cfg = CONFIG[type] || { icon: AlertCircle, bg: "bg-slate-500/10 border-slate-500/20", clr: "text-slate-400", text: log.type };
    const Icon = cfg.icon;

    const renderMessage = () => {
        const template = TEMPLATES[type] || "{target}: {raison}";
        return template.split(/(\{target\}|\{author\}|\{bold_raison\}|\{raison\})/).map((part, i) => {
            if (part === "{target}") return <strong key={i} className="text-white font-extrabold">{log.targetId}</strong>;
            if (part === "{author}") return <strong key={i} className="text-white font-extrabold">{log.authorId}</strong>;
            if (part === "{bold_raison}") return <strong key={i} className="text-white font-extrabold">{log.raison}</strong>;
            if (part === "{raison}") return log.raison;
            return part;
        });
    };

    return (
        <div className="bg-[#140030]/50 border border-border/40 backdrop-blur-md rounded-xl p-4 shadow-md flex items-center gap-4 hover:border-[#25f8ff]/30 hover:bg-[#140030]/80 transition-all duration-300">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border ${cfg.bg} ${cfg.clr}`}>
                <Icon size={18} />
            </div>
            <div className="flex flex-col text-base text-[#8e7aab] font-semibold">
                <div className="text-white font-semibold">
                    {renderMessage()}
                </div>
                <div className="flex items-center gap-2.5 mt-1.5 select-none">
                    <span className={`px-2 py-0.5 rounded-md text-base font-extrabold uppercase tracking-wider border ${cfg.bg} ${cfg.clr}`}>
                        {cfg.text}
                    </span>
                    <span className="text-[#8e7aab] text-base font-semibold">
                        {formatLogDate(log.datetime)}
                    </span>
                </div>
            </div>
        </div>
    );
}
